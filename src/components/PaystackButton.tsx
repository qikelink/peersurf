import React from "react";

const PAYSTACK_PUBLIC_KEY = "pk_test_efbd584b89329953a201d1ba286788eb30499e16"; // Replace with your real key

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface PaystackButtonProps {
  email: string;
  amount: number;
  userId: string;
  onSuccess: (response: any) => void;
  onClose: () => void;
}

const PaystackButton: React.FC<PaystackButtonProps> = ({ email, amount, userId, onSuccess, onClose }) => {
  const payWithPaystack = () => {
    const handler = window.PaystackPop && window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: amount * 100, // Paystack expects amount in kobo
      currency: "NGN",
      metadata: {
        custom_fields: [
          { display_name: "User ID", variable_name: "user_id", value: userId }
        ]
      },
      callback: function(response: any) {
        onSuccess(response);
      },
      onClose: function() {
        onClose();
      }
    });
    handler && handler.openIframe();
  };

  return (
    <button
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
      onClick={payWithPaystack}
    >
      Fund Wallet
    </button>
  );
};

export default PaystackButton; 