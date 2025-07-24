import { ArrowLeft, TrendingUp, Clock, Wallet as WalletIcon } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import ActionButtons from "../ui/action-buttons";
import { useUser } from "../../contexts/UserContext";
import { useState } from "react";
import Loader from "../ui/loader";
import EmptyState from "../ui/empty-state";

// Livepeer green colors
const LIVEPEER_GREEN = "#006400";

type PortfolioPageProps = {
  onBack: () => void;
};

const LPT_PRICE_USD = 7.22;
const USD_TO_NAIRA = 1526;
const USD_TO_EUR = 0.92;
const USD_TO_GBP = 0.79;
const getConversionRate = (currency: string) => {
  switch (currency) {
    case "NGN": return USD_TO_NAIRA;
    case "EUR": return USD_TO_EUR;
    case "GBP": return USD_TO_GBP;
    default: return 1;
  }
};

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onBack }) => {
  const { user, loading: userLoading, stakes, currency } = useUser();
  const [error] = useState<string | null>(null);

  if (userLoading) return <Loader />;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!user) return null;

  const conversionRate = getConversionRate(currency);
  const lptPrice = LPT_PRICE_USD * conversionRate;
  // Calculate portfolio summary in fiat
  const totalStaked = stakes.reduce((sum, s) => sum + (Number(s.amount) * lptPrice || 0), 0);
  const projectedEarnings = stakes.reduce((sum, s) => sum + ((Number(s.amount) * lptPrice || 0) * (Number(s.apy) || 0) / 100), 0);
  const lifetimeEarnings = stakes.reduce((sum, s) => sum + (Number(s.earnings) * lptPrice || 0), 0);
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-8">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <div className="font-semibold text-lg">Portfolio</div>
          <div className="text-xs text-gray-500">Your staking overview</div>
        </div>
      </div>
      <div className="px-4 pb-20">
        {/* Portfolio Summary Cards */}
        <div className="mt-6 mb-6">
          <Card
            className="p-6 rounded-2xl mb-4 border-0"
            style={{ background: "#F6FFF9", border: "1px solid #C6F7E2" }}
          >
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">
                Total Portfolio Value
              </div>
              <div
                className="text-4xl font-bold mb-4"
                style={{ color: LIVEPEER_GREEN }}
              >
                {formatCurrency(totalStaked)}
              </div>
            </div>
          </Card>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Card
              className="p-4 rounded-xl"
              style={{ background: "#F6FFF9", border: "1px solid #C6F7E2" }}
            >
              <div className="text-xs text-gray-600 mb-1">
                Projected Earnings
              </div>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(projectedEarnings)}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp
                  className="h-3 w-3"
                  style={{ color: LIVEPEER_GREEN }}
                />
                <span className="text-xs" style={{ color: LIVEPEER_GREEN }}>
                  +12.5%
                </span>
              </div>
            </Card>
            <Card
              className="p-4 rounded-xl"
              style={{ background: "#F6FFF9", border: "1px solid #C6F7E2" }}
            >
              <div className="text-xs text-gray-600 mb-1">
                Lifetime Earnings
              </div>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(lifetimeEarnings)}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" style={{ color: LIVEPEER_GREEN }} />
                <span className="text-xs text-gray-500">All time</span>
              </div>
            </Card>
          </div>
        </div>
        {/* Current Stakes */}
        <div className="text-sm text-gray-700 font-semibold mb-3">
          Your Current Stakes
        </div>
        <div className="space-y-3 pb-10">
          {stakes.length === 0 ? (
            <EmptyState message="You have no delegated stakes yet." icon={<WalletIcon />} />
          ) : (
            stakes.map((stake) => (
              <Card
                key={stake.id}
                className="border-0 rounded-xl p-4"
                style={{ background: "#F6FFF9", border: "1px solid #C6F7E2" }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-black text-base">
                      {stake.orchestrator_name}
                    </div>
                    <div className="text-xs text-gray-600">
                      APY: {" "}
                      <span
                        className="font-medium"
                        style={{ color: LIVEPEER_GREEN }}
                      >
                        {stake.apy}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-sm font-semibold"
                      style={{ color: LIVEPEER_GREEN }}
                    >
                      {formatCurrency(Number(stake.amount) * lptPrice)}
                    </div>
                    <div className="text-xs text-gray-600">Staked</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-gray-600">Earnings</div>
                    <div className="font-semibold text-black">
                      {formatCurrency(Number(stake.earnings) * lptPrice)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Status</div>
                    <div className="font-semibold text-black">
                      {stake.status}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">APY</div>
                    <div className="font-semibold text-black">
                      {stake.apy}%
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 text-xs rounded-full"
                      style={{ background: LIVEPEER_GREEN, color: "#fff" }}
                    >
                      Add Stake
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-xs rounded-full border-gray-300"
                    >
                      Unstake
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
      {/* Action Buttons - Fixed at bottom */}
      <ActionButtons />
    </div>
  );
};
