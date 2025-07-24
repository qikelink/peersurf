import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ActionButtons from "../ui/action-buttons";
import Loader from "../ui/loader";
import EmptyState from "../ui/empty-state";
import { Wallet as WalletIcon, Info, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useEffect, useState } from "react";
import orchestrators from "../../data/orchestrators.json";

// Livepeer green: #00EB88
const LIVEPEER_GREEN = "#006400";
const LIVEPEER_GRADIENT = "linear-gradient(135deg, #006400 0%, #00EB88 100%)";

const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
  GBP: "£",
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
const getCurrencySymbol = (currency: string) => CURRENCY_SYMBOLS[currency] || "$";

const ACTION_BUTTONS_HEIGHT = 104;

const WalletDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading, profile, stakes, currency } = useUser();
  const [error, setError] = useState<string | null>(null);
  // Remove orchestrator fetch logic and use orchestrators from JSON
  // const [orchestrators, setOrchestrators] = useState<any[]>([]);
  // const [orchLoading, setOrchLoading] = useState(true);
  // const [orchError, setOrchError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/auth");
    }
  }, [user, userLoading, navigate]);

  // Remove orchestrator fetch logic and use orchestrators from JSON
  // useEffect(() => {
  //   setOrchLoading(true);
  //   setOrchError(null);
  //   fetch("https://orchestrator.livepeer.org/api/leaderboard?limit=15")
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Failed to fetch orchestrators");
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setOrchestrators(data || []);
  //     })
  //     .catch((err) => setOrchError(err.message || "Failed to fetch orchestrators"))
  //     .finally(() => setOrchLoading(false));
  // }, []);

  if (userLoading) return <Loader />;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!user || !profile) return null;

  const conversionRate = getConversionRate(currency);
  const lptPrice = LPT_PRICE_USD * conversionRate;
  // Calculate wallet balance as sum of all stakes (in fiat)
  const walletBalance = stakes.reduce((sum, s) => sum + (Number(s.amount) * lptPrice || 0), 0);
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <div onClick={() => navigate("/profile")}
            className="cursor-pointer">
            <Avatar>
              <AvatarImage src={profile.avatar_url || "https://github.com/shadcn.png"} />
              <AvatarFallback>{profile.username?.slice(0, 2)?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="font-semibold text-base leading-tight">
              Welcome, {profile.full_name || profile.username || user.email || "User"}
            </div>
            <div className="text-xs text-gray-500">
              How bullish on livepeer are you?
            </div>
          </div>
        </div>
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
          onClick={() => navigate("/notifications")}
        >
          <Bell className="w-6 h-6 text-gray-700" />
        </button>
      </div>
      {/* Wallet Info Card */}
      <div className="px-4">
        <Card
          className="rounded-2xl p-6 mb-6 shadow-lg relative overflow-hidden"
          style={{
            background: LIVEPEER_GRADIENT,
            color: "#fff",
            border: "none",
          }}
        >
          <div className="flex items-center">
            <div>
              <div className="uppercase text-xs tracking-widest opacity-80">
                Wallet Balance
              </div>
              <div className="text-3xl font-bold tracking-tight mt-1">
                {formatCurrency(walletBalance)}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div>
              <div className="opacity-80">User ID</div>
              <div className="font-medium text-white">
                {(() => {
                  const id = profile.username || user.email || "";
                  if (!id) return "";
                  // If it's an email, show first 3 + ... + domain
                  if (id.includes("@")) {
                    const [name, domain] = id.split("@");
                    return `${name.slice(0, 3)}...@${domain}`;
                  }
                  // If it's a username or address, show first 4 + ... + last 4
                  if (id.length <= 8) return id;
                  return `${id.slice(0, 4)}...${id.slice(-4)}`;
                })()}
              </div>
            </div>

            <Button
              className="rounded text-xs bg-white/20 hover:bg-white/30 text-white border border-white/30 w-fit"
              onClick={() => navigate("/dashboard")}
            >
              <WalletIcon className="h-3 w-3 mr-2" />
              View Portfolio
            </Button>
          </div>
        </Card>
      </div>
      {/* Action Buttons - Fixed at bottom */}
      <ActionButtons />
      {/* Orchestrators List - Only this scrolls */}
      <div
        className="flex-1 overflow-y-auto px-4"
        style={{
          marginBottom: `${ACTION_BUTTONS_HEIGHT}px`,
        }}
      >
        <div className="text-sm text-gray-700 font-semibold mb-2 mt-2">
          Available Offers
        </div>
        <div className="space-y-3 pb-8">
          {orchestrators.length === 0 ? (
            <EmptyState message="No orchestrators available." icon={<Info />} />
          ) : (
            orchestrators.map((orc: any) => (
              <Card
                key={orc.address}
                className="border-0 rounded-xl p-4 flex flex-col gap-2"
                style={{
                  background: "#F6FFF9",
                  border: `1px solid #C6F7E2`,
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-black text-base">
                      {orc.name || orc.address.slice(0, 6) + "..." + orc.address.slice(-4)}
                    </div>
                    <div className="text-xs text-gray-600">
                      APY: {" "}
                      <span
                        className="font-medium"
                        style={{ color: LIVEPEER_GREEN }}
                      >
                        {orc.apy}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="text-xs font-semibold rounded-full px-4 py-2"
                    style={{
                      background: LIVEPEER_GREEN,
                      color: "#fff",
                    }}
                    onClick={() => navigate("/delegate", { state: { orchestrator: orc } })}
                  >
                    Delegate
                  </Button>
                </div>
                <div className="flex gap-4 text-xs text-gray-600 mt-1">
                  <div>
                    Staked: <span className="text-black">{formatCurrency(Number(orc.totalStake.replace(/[^\d.]/g, "")) * lptPrice)}</span>
                  </div>
                  <div>
                    Performance: {" "}
                    <span className="text-black">{orc.performance}</span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;
