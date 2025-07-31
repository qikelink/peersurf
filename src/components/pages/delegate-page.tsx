import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Info,
  Shield,
  InfoIcon,
  CircleDollarSign,
  HandCoins,
  TrendingUp,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { usePrivyContext } from "../../contexts/PrivyContext";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { createStake } from "../../lib/auth";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../ui/loader";
import EmptyState from "../ui/empty-state";
import ActionButtons from "../ui/action-buttons";
import { delegateTokens } from "../../lib/livepeer";
import { ethers } from "ethers";

const LIVEPEER_GREEN = "#006400";

const LPT_PRICE_USD = 7.22;

// Livepeer staking docs URL
const LIVEPEER_STAKING_URL = "https://www.livepeer.org/delegate";

const DelegatePage = () => {
  const [stakeAmount, setStakeAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [signer, setSigner] = useState<any>(null);

  const {
    user,
    loading: userLoading,
    refreshStakes,
    currency,
  } = usePrivyContext();
  const { wallets } = useWallets();
  const { authenticated } = usePrivy();
  const navigate = useNavigate();
  const location = useLocation();
  const orchestrator = location.state?.orchestrator;

  // Initialize wallet connection in background
  useEffect(() => {
    const initializeWallet = async () => {
      if (authenticated && wallets.length > 0) {
        try {
          const wallet = wallets[0];
          const provider = await wallet.getEthereumProvider();
          const ethersProvider = new ethers.BrowserProvider(provider);
          const signer = await ethersProvider.getSigner();
          setSigner(signer);
        } catch (error) {
          console.error("Error initializing wallet:", error);
        }
      }
    };

    initializeWallet();
  }, [authenticated, wallets]);

  if (userLoading || loading) return <Loader />;
  if (!orchestrator) {
    return (
      <EmptyState
        message="No orchestrator selected. Please go back and choose an orchestrator."
        icon={<Info />}
      />
    );
  }

  // Calculate projected earnings
  const calculateEarnings = (amount: string | number) => {
    const numAmount =
      typeof amount === "number"
        ? amount
        : amount === "max"
        ? 2500 // fallback max
        : parseFloat(amount);
    if (!numAmount || isNaN(numAmount))
      return { daily: 0, monthly: 0, yearly: 0 };
    // Use orchestrator.apy (as a percent string, e.g. "15.2%")
    const apy = parseFloat(orchestrator.apy) / 100;
    // Convert fiat to LPT
    const lptAmount = numAmount / LPT_PRICE_USD;
    const dailyLPT = (lptAmount * apy) / 365;
    const monthlyLPT = dailyLPT * 30;
    const yearlyLPT = lptAmount * apy;
    // Convert LPT earnings to fiat
    const daily = dailyLPT * LPT_PRICE_USD;
    const monthly = monthlyLPT * LPT_PRICE_USD;
    const yearly = yearlyLPT * LPT_PRICE_USD;
    return { daily, monthly, yearly };
  };

  const earnings = calculateEarnings(stakeAmount);
  const isValidAmount = stakeAmount && parseFloat(stakeAmount) >= 0;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  const handleDelegate = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!authenticated || !signer) {
      setError("Please sign in to continue.");
      setLoading(false);
      return;
    }

    try {
      // Convert fiat amount to LPT tokens (assuming 1 LPT = $7.22)
      const lptAmount = (parseFloat(stakeAmount) / LPT_PRICE_USD).toString();

      // Delegate tokens using Livepeer SDK
      const result = await delegateTokens(
        orchestrator.address,
        lptAmount,
        signer
      );

      if (result.success) {
        // Also save to local database for tracking
        const stakeData = {
          user_id: user.id,
          orchestrator_id: orchestrator.address,
          orchestrator_name: orchestrator.name,
          amount: parseFloat(stakeAmount),
          apy: parseFloat(orchestrator.apy),
          status: "active" as const,
          earnings: 0,
        };
        await createStake(stakeData);

        setSuccess("Stake delegated successfully!");
        setStakeAmount("");
        await refreshStakes();

        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setError(result.error || "Failed to delegate investment");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delegate investment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-8">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <div className="font-semibold text-lg">Delegate Holdings</div>
          <div className="text-xs text-gray-500">Stake to earn rewards</div>
        </div>
      </div>

      <div className="px-4 pb-20">
        {/* Orchestrator Info Card */}
        <Card
          className="mt-6 p-5 rounded-xl border-0"
          style={{ background: "#F6FFF9", border: "1px solid #C6F7E2" }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="font-bold text-lg text-gray-900">
                {orchestrator.name}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {orchestrator.description}
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-2xl font-bold"
                style={{ color: LIVEPEER_GREEN }}
              >
                {orchestrator.apy}
              </div>
              <div className="text-xs text-gray-500">APY</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Shield className="h-3 w-3 text-gray-500" />
                <span className="text-gray-500">Performance</span>
              </div>
              <div className="font-semibold text-gray-900">
                {orchestrator.performance}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CircleDollarSign className="h-3 w-3 text-gray-500" />
                <span className="text-gray-500">Fee cut</span>
              </div>
              <div className="font-semibold text-gray-900">
                {orchestrator.fee}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <HandCoins className="h-3 w-3 text-gray-500" />
                <span className="text-gray-500">Reward cut</span>
              </div>
              <div className="font-semibold text-gray-900">
                {orchestrator.reward}
              </div>
            </div>
          </div>
        </Card>

        {/* Stake Amount Input + Projected Earnings (merged card) */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-gray-700">
              Delegate Amount
            </span>
            <Info className="h-4 w-4 text-gray-400" />
          </div>

          <Card className="p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full text-xl font-bold border-0 outline-none bg-transparent"
                  style={{ color: LIVEPEER_GREEN }}
                />
              </div>
            </div>

            {/* Projected Earnings (always visible, but grayed out if not valid) */}
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp
                  className="h-4 w-4"
                  style={{ color: LIVEPEER_GREEN }}
                />
                <span className="text-sm font-semibold text-gray-700">
                  Projected earning
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xs text-gray-500">Daily</div>
                  <div
                    className="font-semibold"
                    style={{
                      color: LIVEPEER_GREEN,
                      opacity: isValidAmount ? 1 : 0.5,
                    }}
                  >
                    {formatCurrency(earnings.daily)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Monthly</div>
                  <div
                    className="font-semibold"
                    style={{
                      color: LIVEPEER_GREEN,
                      opacity: isValidAmount ? 1 : 0.5,
                    }}
                  >
                    {formatCurrency(earnings.monthly)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Yearly</div>
                  <div
                    className="font-semibold"
                    style={{
                      color: LIVEPEER_GREEN,
                      opacity: isValidAmount ? 1 : 0.5,
                    }}
                  >
                    {formatCurrency(earnings.yearly)}
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                * Earnings are estimates based on current APY and may vary
              </div>
            </div>
          </Card>
        </div>

        {/* Important Info */}
        <Card className="mt-4 p-4 rounded-xl border border-orange-200 bg-orange-50">
          <div className="flex gap-3">
            <Info className="h-4 w-4 text-orange-800 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-semibold text-orange-800 mb-1">
                Important Information
              </div>
              <div className="text-orange-800 space-y-1">
                <div>• Rewards are distributed every round</div>
                <div>• Unstaking has a 7-day unbonding period</div>
                <div>• Rewards begin from next round after you delegate</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="my-8 space-y-3">
          {/* Delegate Button */}
          <Button
            className="w-full h-12 rounded-xl font-semibold text-base"
            style={{
              background: isValidAmount ? LIVEPEER_GREEN : "#9CA3AF",
              color: "#fff",
            }}
            disabled={!isValidAmount || loading || !authenticated}
            onClick={handleDelegate}
          >
            {loading
              ? "Delegating..."
              : !authenticated
              ? "Please Sign In to Continue"
              : !stakeAmount
              ? "Enter Amount to Continue"
              : !isValidAmount
              ? `Minimum ${formatCurrency(0)} Required`
              : `Delegate ${formatCurrency(parseFloat(stakeAmount))}`}
          </Button>

          {error && (
            <div className="text-red-600 mb-4 text-xs mx-auto">{error}</div>
          )}
          {success && (
            <div className="text-green-600 mb-4 text-xs mx-auto">{success}</div>
          )}

          <div className="text-center">
            <a
              href={LIVEPEER_STAKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={0}
              className="inline-flex items-center justify-center text-sm text-gray-600 hover:text-green-700 transition focus:outline-none"
              style={{ textDecoration: "none" }}
            >
              Learn more about staking <InfoIcon className="ml-1 w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      {/* Action Buttons - Fixed at bottom */}
      <ActionButtons />
    </div>
  );
};

export default DelegatePage;
