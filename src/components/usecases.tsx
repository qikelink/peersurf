import { useNavigate } from "react-router-dom";
import { Wallet, TrendingUp, Users, Zap, Target, Rocket } from "lucide-react";

const UseCasesSection = () => {
  const navigate = useNavigate();

  const opportunities = [
    {
      title: "Earn",
      description: "Delegate to orchestrators and earn up to 65% APY",
      icon: <TrendingUp className="w-8 h-8" />,
      gradient: "from-green-600 to-green-800",
      action: "Start Earning",
      link: "/wallet"
    },
    {
      title: "Discover",
      description: "Find the best orchestrators and opportunities",
      icon: <Target className="w-8 h-8" />,
      gradient: "from-blue-600 to-blue-800",
      action: "Explore",
      link: "/wallet"
    },
    {
      title: "Build",
      description: "Grow your Livepeer portfolio and track performance",
      icon: <Rocket className="w-8 h-8" />,
      gradient: "from-purple-600 to-purple-800",
      action: "Build Portfolio",
      link: "/dashboard"
    },
    {
      title: "Connect",
      description: "Join the community of builders and creators",
      icon: <Users className="w-8 h-8" />,
      gradient: "from-orange-600 to-orange-800",
      action: "Join Community",
      link: "/profile"
    },
    {
      title: "Fund",
      description: "Add funds to your wallet and start delegating",
      icon: <Wallet className="w-8 h-8" />,
      gradient: "from-teal-600 to-teal-800",
      action: "Add Funds",
      link: "/funding"
    },
    {
      title: "Optimize",
      description: "Use advanced tools to maximize your rewards",
      icon: <Zap className="w-8 h-8" />,
      gradient: "from-pink-600 to-pink-800",
      action: "Optimize",
      link: "/wallet"
    }
  ];

  return (
  <section className="w-full py-20 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
              Discover Opportunities
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join the talent layer of decentralized video. Choose your path and start building your future.
          </p>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities.map((opportunity, index) => (
            <div
              key={index}
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-500 hover:transform hover:scale-105"
            >
              {/* Card Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${opportunity.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${opportunity.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {opportunity.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-4">
                  {opportunity.title}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {opportunity.description}
                </p>
                
                {/* Action Button */}
                <button
                  onClick={() => navigate(opportunity.link)}
                  className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-medium transition-colors duration-300 group-hover:gap-3"
                >
                  {opportunity.action}
                  <span className="text-lg">→</span>
                </button>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button
            onClick={() => navigate("/opportunities")}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
          >
            Get Started with PeerSurf
          </button>
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
