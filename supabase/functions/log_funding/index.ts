import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { user_id, amount, currency, tx_hash, wallet_address } = body;
  if (!user_id || !amount || !currency || !tx_hash || !wallet_address) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Insert the funding event
  const { error: insertError } = await supabase
    .from("fundings")
    .insert([{ user_id, amount, currency, tx_hash, wallet_address }]);

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
  }

  // Update the user's wallet balance
  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("total_staked")
    .eq("id", user_id)
    .single();

  if (profileError) {
    return new Response(JSON.stringify({ error: profileError.message }), { status: 500 });
  }

  const newBalance = (userProfile?.total_staked || 0) + Number(amount);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ total_staked: newBalance })
    .eq("id", user_id);

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}); 