import React, { useState } from "react";
import ActionButtons from "../ui/action-buttons";
import { usePrivyContext } from "../../contexts/PrivyContext";
import { useWallets } from "@privy-io/react-auth";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

const ACTION_BUTTONS_HEIGHT = 104;

// Hardcoded conversion rates (as of June 2024, update as needed)
const CONVERSION_RATES: Record<string, number> = {
  USDC: 1, // 1 USDC = 1 USD
  USD: 1, // 1 USD = 1 USDC
  NGN: 1500, // 1 USDC = 1500 NGN
  EUR: 0.92, // 1 USDC = 0.92 EUR
  GBP: 0.79, // 1 USDC = 0.79 GBP
};

const currencyToUSDC = (amount: number, currency: string): number => {
  if (currency === "USDC" || currency === "USD") return amount;
  if (currency === "NGN") return amount / CONVERSION_RATES.NGN;
  if (currency === "EUR") return amount / CONVERSION_RATES.EUR;
  if (currency === "GBP") return amount / CONVERSION_RATES.GBP;
  return amount;
};

const usdcToCurrency = (usdcAmount: number, currency: string): number => {
  if (currency === "USDC" || currency === "USD") return usdcAmount;
  if (currency === "NGN") return usdcAmount * CONVERSION_RATES.NGN;
  if (currency === "EUR") return usdcAmount * CONVERSION_RATES.EUR;
  if (currency === "GBP") return usdcAmount * CONVERSION_RATES.GBP;
  return usdcAmount;
};

const MIN_USDC = 1;

const PrivyFundingPage: React.FC = () => {
  const { user, currency } = usePrivyContext();
  const { wallets } = useWallets();
 
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [loading] = useState(false);
  const [showOnramper, setShowOnramper] = useState(false);

  // Calculate the minimum in the selected currency
  const minInCurrency = usdcToCurrency(MIN_USDC, currency);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    const val = Number(e.target.value);
    setAmount(val > 0 ? val : null);
  };

  const handleFundWallet = async () => {
    if (!user || !amount || currencyToUSDC(amount, currency) < MIN_USDC) {
      alert(
        `Please enter a valid amount (minimum ${minInCurrency.toLocaleString(
          undefined,
          {
            maximumFractionDigits: 2,
          }
        )} ${currency} ≈ ${MIN_USDC} USDC)`
      );
      return;
    }

    if (wallets.length === 0) {
      alert("No wallet available. Please ensure you have a wallet connected.");
      return;
    }

    setShowOnramper(true);

    // Commented out Privy funding method - might use later
    /*
    setLoading(true);
    try {
      // Use the fundWallet method with the user's wallet address
      const wallet = wallets[0];
      if (wallet) {
        // Always fund in USDC
        const usdcAmount = currencyToUSDC(amount, currency);
        await fundWallet(wallet.address, {
          amount: usdcAmount.toFixed(2), 
        });
      }
    } catch (error) {
      console.error("Funding error:", error);
      alert("Failed to initiate funding. Please try again.");
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-8 pb-4">
        <div>
          <div className="font-semibold text-lg">Add Funds</div>
          <div className="text-xs text-gray-500">
            Fund your Lisa wallet with fiat
          </div>
        </div>
      </div>

             {/* Onramper Modal */}
       <Dialog open={showOnramper} onOpenChange={setShowOnramper}>
         <DialogContent className="max-w-2xl w-[90vw] h-[630px] p-0">
           <DialogTitle className="sr-only">Add Funds with Onramper</DialogTitle>
           <div className="w-full h-full relative">
             <iframe
               src={`https://buy.onramper.dev?hideTopBar=true&apiKey=pk_test_01K0WJW6V5JX13QPG83NS8AK3Z&mode=buy&onlyCryptos=${
                 currency === 'NGN' ? 'usdt_arbitrum' : 'lpt_ethereum'
               }&networkWallets=${
                 currency === 'NGN' ? 'arbitrum' : 'ethereum'
               }:${wallets[0]?.address || ""}&defaultFiat=${currency}&defaultAmount=${amount}&enableCountrySelector=true`}
               title="Onramper Widget"
               className="w-full h-full border-0 rounded"
               frameBorder="0"
               allow="accelerometer; autoplay; camera; gyroscope; payment; microphone"
               sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
             />
           </div>
         </DialogContent>
       </Dialog>

      <div
        className="flex-1 px-4 pb-8"
        style={{ marginBottom: `${ACTION_BUTTONS_HEIGHT}px` }}
      >
        <div className="max-w-md mx-auto mt-2 p-6 bg-white rounded-xl shadow space-y-6 border border-gray-100">
          {/* Amount input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Amount ({currency}){" "}
              {/* <span className="text-xs text-gray-400">
                min: {minInCurrency.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span> */}
            </label>
            <input
              type="number"
              min={minInCurrency}
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="w-full p-3 border rounded-md"
              placeholder={`Enter amount in ${currency}`}
            />
            <div className="text-xs text-gray-500 mt-1">
              ≈{" "}
              {amount && amount > 0
                ? currencyToUSDC(amount, currency).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })
                : "0"}{" "}
              USDC
            </div>
          </div>

          {/* Fund Button */}
          <button
            className={`w-full py-3 px-6 rounded-md font-semibold text-white transition-all duration-200 ${
              !amount || currencyToUSDC(amount, currency) < MIN_USDC || loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500 shadow-lg"
            }`}
            onClick={handleFundWallet}
            disabled={
              !amount || currencyToUSDC(amount, currency) < MIN_USDC || loading
            }
          >
            {loading ? "Processing..." : `Fund Wallet`}
          </button>

          {loading && (
            <div className="text-center text-sm text-gray-500">
              Opening payment options...
            </div>
          )}
        </div>
      </div>
      <ActionButtons />
    </div>
  );
};

export default PrivyFundingPage;
