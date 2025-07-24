import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function verifyPaystackSignature(secret: string, body: string, signature: string) {
  const encoder = new TextEncoder();
  const key = encoder.encode(secret);
  const data = encoder.encode(body);
  return crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-512" }, false, ["sign", "verify"])
    .then(cryptoKey => crypto.subtle.sign("HMAC", cryptoKey, data))
    .then(sigBuffer => {
      const hashArray = Array.from(new Uint8Array(sigBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      return hashHex === signature;
    });
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET_KEY")!;
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";
  const isValid = await verifyPaystackSignature(PAYSTACK_SECRET, rawBody, signature);
  if (!isValid) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const event = JSON.parse(rawBody);
  if (event.event === "charge.success") {
    const { email, amount, reference, metadata } = event.data;
    const userId = metadata?.custom_fields?.find((f: any) => f.variable_name === "user_id")?.value;
    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID missing in metadata" }), { status: 400 });
    }
    // Log funding
    await supabase.from("fundings").insert([{
      user_id: userId,
      amount: amount / 100, // Convert kobo to NGN
      currency: "NGN",
      tx_hash: reference,
      wallet_address: null
    }]);
    // Update user balance
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("total_staked")
      .eq("id", userId)
      .single();
    if (!profileError && userProfile) {
      const newBalance = (userProfile.total_staked || 0) + (amount / 100);
      await supabase
        .from("profiles")
        .update({ total_staked: newBalance })
        .eq("id", userId);
    }
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}); 