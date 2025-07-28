import React, { useState, useEffect } from "react";
import {
  DollarSign,
  BarChart3,
  Calculator,
  TrendingUp,
  Info,
  Zap,
} from "lucide-react";
import ActionButtons from "../ui/action-buttons";
import orchestratorsData from "../../data/orchestrators.json";
import { useUser } from "../../contexts/UserContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Add a currency conversion utility
const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
  GBP: "£",
};
const LPT_PRICE_USD = 7.32;
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

// Constants for conversion
const LIVEPEER_GRADIENT = "linear-gradient(135deg, #006400 0%, #00EB88 100%)";
const ACTION_BUTTONS_HEIGHT = 104;

// Parse orchestrators for numeric APY and commission
const orchestratorsList = (orchestratorsData as any[]).map((orch) => ({
  id: orch.address,
  name: orch.name,
  apy: parseFloat(orch.apy.replace("%", "")),
  fee: parseFloat(orch.fee.replace("%", "")) / 100,
  address: orch.address,
}));

const CalculatorPage: React.FC = () => {
  const { currency } = useUser();
  // Amount in naira
  const [delegationAmountNaira, setDelegationAmountNaira] = useState("");
  const [selectedOrchestrator, setSelectedOrchestrator] = useState(
    orchestratorsList[0]
  );
  const [results, setResults] = useState({
    dailyRewards: 0,
    monthlyRewards: 0,
    yearlyRewards: 0,
    totalReturn: 0,
    apy: 0,
  });

  const conversionRate = getConversionRate(currency);
  const lptPrice = LPT_PRICE_USD * conversionRate;

  useEffect(() => {
    const amount = parseFloat(delegationAmountNaira);
    if (
      !isNaN(amount) &&
      amount > 0 &&
      selectedOrchestrator &&
      selectedOrchestrator.apy
    ) {
      // Convert fiat to LPT
      const lptAmount = amount / lptPrice;
      const { apy, fee } = selectedOrchestrator;
      // Calculate annual yield in LPT
      const annualLPT = (lptAmount * apy) / 100;
      const netAnnualLPT = annualLPT * (1 - fee);
      // Convert yields to fiat
      const yearly = netAnnualLPT * lptPrice;
      const monthly = yearly / 12;
      const daily = yearly / 365;
      // Total value in fiat (principal + yearly yield)
      const totalReturn = amount + yearly;
      setResults({
        dailyRewards: daily,
        monthlyRewards: monthly,
        yearlyRewards: yearly,
        totalReturn,
        apy,
      });
    } else {
      setResults({
        dailyRewards: 0,
        monthlyRewards: 0,
        yearlyRewards: 0,
        totalReturn: 0,
        apy: 0,
      });
    }
  }, [delegationAmountNaira, selectedOrchestrator, currency]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  const formatPercentage = (pct: number) => `${pct.toFixed(2)}%`;

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-8 pb-4">
        <div>
          <div className="font-semibold text-base leading-tight">
            Yield Calculator
          </div>
          <div className="text-xs text-gray-500">
            Calculate your potential rewards
          </div>
        </div>
      </div>

      <div
        className="flex-1 px-4 pb-8"
        style={{ paddingBottom: `${ACTION_BUTTONS_HEIGHT + 32}px` }}
      >
        {/* Calculator Card */}
        <div
          className="rounded-2xl p-6 shadow-lg relative overflow-hidden mb-6"
          style={{
            background: LIVEPEER_GRADIENT,
            color: "#fff",
            border: "none",
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="uppercase text-xs tracking-widest opacity-80">
                Earnings Calculator
              </div>
              <div className="text-xl font-bold tracking-tight mt-1">
                Forecast Your Earnings
              </div>
            </div>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="space-y-6">
          {/* Orchestrator Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Orchestrator
            </label>
            <Select
              value={selectedOrchestrator.id}
              onValueChange={(value) => {
                const selected = orchestratorsList.find(
                  (orch) => orch.id === value
                );
                if (selected) setSelectedOrchestrator(selected);
              }}
            >
              <SelectTrigger className="w-full py-6 border rounded border-gray-200 bg-white text-black text-lg font-semibold focus:outline-none">
                <SelectValue placeholder="Choose an orchestrator" />
              </SelectTrigger>
              <SelectContent>
                {orchestratorsList.map((orch) => (
                  <SelectItem key={orch.id} value={orch.id} className="px-2 py-4 rounded">
                    {orch.name} - APY: {orch.apy}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Delegation Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delegation Amount ({getCurrencySymbol(currency)})
            </label>
            <input
              type="number"
              min={0}
              placeholder="Enter amount"
              className="w-full px-3 py-2.5 rounded border border-gray-200 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-colors text-lg font-semibold"
              value={delegationAmountNaira}
              onChange={(e) => setDelegationAmountNaira(e.target.value)}
            />
          </div>
        </div>

        {/* Results Section */}
        {delegationAmountNaira && !isNaN(parseFloat(delegationAmountNaira)) && (
          <div className="mt-8 space-y-4">
            {/* Earnings Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <div className="text-xs font-medium text-blue-700">Daily</div>
                </div>
                <div className="text-lg font-bold text-blue-800">
                  {formatCurrency(results.dailyRewards)}
                </div>
              </div>

              <div className="rounded-xl p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-orange-600" />
                  <div className="text-xs font-medium text-orange-700">
                    Monthly
                  </div>
                </div>
                <div className="text-lg font-bold text-orange-800">
                  {formatCurrency(results.monthlyRewards)}
                </div>
              </div>

              <div className="rounded-xl p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <div className="text-xs font-medium text-purple-700">
                    Yearly
                  </div>
                </div>
                <div className="text-lg font-bold text-purple-800">
                  {formatCurrency(results.yearlyRewards)}
                </div>
              </div>

              <div className="rounded-xl p-4 bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-gray-700" />
                  <div className="text-xs font-medium text-gray-700">
                    Total Value
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(results.totalReturn)}
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div
              className="rounded-2xl p-6 shadow-lg relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f87171 100%)",
                color: "#fff",
                border: "none",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm opacity-90">
                    Total Projected Return
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(results.totalReturn)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90">APY</div>
                  <div className="text-xl font-bold">
                    {formatPercentage(results.apy)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <Info className="w-4 h-4" />
                <span>Based on {selectedOrchestrator.name} over 1 year</span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl p-4 bg-yellow-50 border border-yellow-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <div className="font-medium mb-1">Important Disclaimer</div>
                  <div className="text-xs leading-relaxed">
                    These calculations are estimates based on current APY and
                    LPT price. Actual returns may vary due to network
                    conditions, orchestrator performance, and market volatility.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <ActionButtons />
    </div>
  );
};

export default CalculatorPage;
