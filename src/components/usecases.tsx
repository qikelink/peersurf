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
            Effortless Earning Onchain
          </h2>
          <div className="text-lg text-gray-600 max-w-2xl mx-auto">
            We handle the hard parts of crypto so you can start earning rewards
            onchain in minutes.
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Card 1: Fund with Fiat */}
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 mb-2">
                Fund with Fiat
              </CardTitle>
              <CardDescription className="text-gray-600 mb-4">
                No need to go through exchanges. Connect your bank account or
                card and fund your wallet directly with your local currency.
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
                One-Click Staking
              </CardTitle>
              <CardDescription className="text-gray-600 mb-4">
                Browse all available Livepeer orchestrators, see their
                performance, and delegate your stake with a single click right
                from our dashboard.
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
                Earn on Autopilot
              </CardTitle>
              <CardDescription className="text-gray-600 mb-4">
                Sit back and watch your rewards grow. No manual actions or
                monitoring required. Withdraw whenever you want to.
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
