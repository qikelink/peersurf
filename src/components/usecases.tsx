import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

export const UseCasesSection = () => {
  return (
    <section className="w-full bg-white py-24 px-4 flex flex-col items-center justify-center">
      <div className="max-w-7xl w-full mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-black mb-4">
            Secure Livepeer Network, Earn Rewards
          </h2>
          <div className="text-lg text-gray-600 max-w-2xl mx-auto">
            Delegate your stake to Livepeer orchestrators and earn up to 65% APY while helping secure the decentralized video network.
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Card 1: Fund with Fiat */}
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 mb-2">
                Fund with Local Currency
              </CardTitle>
              <CardDescription className="text-gray-600 mb-4">
                Skip the crypto exchanges. Fund your Livepeer delegation directly with your local currency—no LPT or ETH needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-start justify-end h-full">
              <img src="/d1.png" className="rounded-3xl" />
            </CardContent>
          </Card>

          {/* Card 2: Choose Your Orchestrator */}
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 mb-2">
                Delegate to Top Orchestrators
              </CardTitle>
              <CardDescription className="text-gray-600 mb-4">
                Choose from verified Livepeer orchestrators with proven track records. See real-time APY, performance, and fee structures.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-start justify-end h-full">
              <img src="/d2.png" className="rounded-3xl" />
            </CardContent>
          </Card>

          {/* Card 3: One-Click Staking */}
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 mb-2">
                Earn Livepeer Rewards
              </CardTitle>
              <CardDescription className="text-gray-600 mb-4">
                Earn up to 65% APY in LPT rewards while helping secure the decentralized video infrastructure. Withdraw anytime.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-start justify-end h-full">
              <img src="/d3.png" className="rounded-3xl" />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
