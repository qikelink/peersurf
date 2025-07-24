import { Card } from "../ui/card";
import {
  Zap,
  TrendingUp,
  Shield,
} from "lucide-react";
import ActionButtons from "../ui/action-buttons";
import { useUser } from "../../contexts/UserContext";


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

const CardsPage = () => {
  const { currency } = useUser();
  const conversionRate = getConversionRate(currency);
  const lptPrice = LPT_PRICE_USD * conversionRate;
  const exampleAmount = 5000 * lptPrice;
  const exampleAnnual = exampleAmount * 0.653;
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  const features = [
    {
      icon: <TrendingUp className="w-5 h-5 text-green-600" />,
      title: "Keep Your Stake Active",
      description:
        "Your principal remains staked to orchestrators, continuing to earn rewards while you spend.",
    },
    {
      icon: <Zap className="w-5 h-5 text-blue-600" />,
      title: "Instant Reward Access",
      description:
        "Staking rewards are automatically transferred to your spending card in real-time.",
    },
    {
      icon: <Shield className="w-5 h-5 text-purple-600" />,
      title: "Secure Spending",
      description:
        "Protected by industry-standard security with fraud monitoring and instant notifications.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-8 pb-4">
        <div className="flex items-center gap-3">
          
          <div>
            <div className="font-semibold text-lg">Lisa Cards</div>
            <div className="text-xs text-gray-500">
              Spend your rewards directly
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-8">
        {/* Hero Card Preview */}
        <div className="mb-8">
          <Card
            className="rounded-2xl p-6 mb-4 shadow-xl relative overflow-hidden border-0"
            style={{
              background: LIVEPEER_GRADIENT,
              color: "#fff",
            }}
          >
            {/* Card mockup */}
            <div className="flex flex-col h-40 justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm opacity-80 mb-1">
                    Lisa Rewards Card
                  </div>
                  <div className="text-xs opacity-60">**** **** **** 1337</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs opacity-80">Cardholder</div>
                    <div className="text-sm font-medium">SERIAL WINNER</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-80">Expires</div>
                    <div className="text-sm font-medium">12/29</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements for visual appeal */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            How Lisa Cards Work
          </h2>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-4 border border-gray-100 rounded-xl bg-gray-50/50"
              >
                <div className="flex gap-3">
                  <div>
                    <h3 className="font-semibold text-base text-gray-900 mb-1 flex items-center gap-2">
                      {feature.title} <span>{feature.icon}</span>
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Example Flow */}
        <div className="mb-24">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            Example Scenario
          </h2>
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    You stake {formatCurrency(50000000)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Your principal stays locked in staking
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Earn 65.3% APY rewards
                  </div>
                  <div className="text-sm text-gray-600">
                    {/* Accurate calculation: $5,000 * 0.653 = $3,265 */}
                    Approximately {formatCurrency(exampleAnnual)} annually in rewards
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Rewards auto-transfer to card
                  </div>
                  <div className="text-sm text-gray-600">
                    Spend while your stake keeps generating more rewards
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

         {/* Action Buttons - Fixed at bottom */}
      <ActionButtons />
      </div>
    </div>
  );
};

export default CardsPage;
