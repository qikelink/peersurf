import React, { useState } from "react";
import ActionButtons from "../ui/action-buttons";
import { CreditCard, Building2 } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import { usePaystackPayment } from "react-paystack";

const LIVEPEER_GREEN = "#006400";
const ACTION_BUTTONS_HEIGHT = 104;
const PAYSTACK_PUBLIC_KEY = "pk_live_290f2e7cb7fd5ce28fcca4c2944d6bf80fccf2c5"; 

const FundingPage: React.FC = () => {
 
  const { user } = useUser();
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    const val = Number(e.target.value);
    setAmount(val > 0 ? val : null);
  };

  const handleFund = (channel: "card" | "bank") => {
    if (!user || !amount || amount < 100) {
      alert("Please enter a valid amount (minimum 100 NGN)");
      return;
    }
    const config = {
      reference: `${user.id}-${Date.now()}`,
      email: user.email,
      amount: amount * 100,
      publicKey: PAYSTACK_PUBLIC_KEY,
      currency: "NGN",
      channels: channel === "card" ? ["card"] : ["bank"],
      metadata: {
        custom_fields: [
          { display_name: "User ID", variable_name: "user_id", value: user.id },
        ],
      },
    };
    const onSuccess = () => {
      alert("Payment initiated! Awaiting confirmation...");
    };
    const onClose = () => {};
    const paystack = usePaystackPayment(config);
    paystack({ onSuccess, onClose });
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-8 pb-4">
        <div>
          <div className="font-semibold text-base leading-tight">Add Funds</div>
          <div className="text-xs text-gray-500">
            Fund your Lisa wallet with fiat
          </div>
        </div>
      </div>
      <div
        className="flex-1 px-4 pb-8"
        style={{ marginBottom: `${ACTION_BUTTONS_HEIGHT}px` }}
      >
        <div className="max-w-md mx-auto mt-2 p-6 bg-white rounded-xl shadow space-y-6 border border-gray-100">
          {/* Amount input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Amount (NGN)
            </label>

            <input
              type="number"
              min={100}
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="w-full p-3 border rounded-md"
              placeholder="Enter amount"
            />
          </div>
          <div className="space-y-4">
            <button
              className={`w-full flex items-center gap-4 rounded-xl p-4 border border-green-200 bg-green-50 hover:bg-green-100 transition ${
                !amount || amount < 100 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => handleFund("card")}
              disabled={!amount || amount < 100}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-black text-base">
                  Fund with Card{" "}
                  <span className="text-xs text-green-600 ml-2">
                    (Recommended)
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  Instant • All cards supported
                </div>
              </div>
            </button>
            <button
              className={`w-full flex items-center gap-4 rounded-xl p-4 border border-green-200 bg-green-50 hover:bg-green-100 transition ${
                !amount || amount < 100 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => handleFund("bank")}
              disabled={!amount || amount < 100}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                <Building2
                  className="w-6 h-6"
                  style={{ color: LIVEPEER_GREEN }}
                />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-black text-base">
                  Fund with Bank Transfer
                </div>
                <div className="text-xs text-gray-600">
                  Send from any bank account
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <ActionButtons />
    </div>
  );
};

export default FundingPage;
