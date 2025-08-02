import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  Filter, 
  MessageCircle, 
  CheckCircle,
  Briefcase,
  Zap,
  Award,
  DollarSign,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

// Mock data for opportunities
const mockBounties = [
  {
    id: 1,
    title: "Build Livepeer Analytics Dashboard",
    team: "PeerSurf Labs",
    verified: true,
    type: "Bounty",
    status: "Active",
    comments: 12,
    reward: "800 USDC",
    category: "Development",
    description: "Create a comprehensive analytics dashboard for Livepeer orchestrators"
  },
  {
    id: 2,
    title: "Design PeerSurf Mobile App UI",
    team: "PeerSurf Design",
    verified: true,
    type: "Bounty",
    status: "Active",
    comments: 8,
    reward: "600 USDC",
    category: "Design",
    description: "Design the mobile app interface for PeerSurf platform"
  },
  {
    id: 3,
    title: "Write Livepeer Ecosystem Guide",
    team: "PeerSurf Content",
    verified: true,
    type: "Bounty",
    status: "Active",
    comments: 5,
    reward: "400 USDC",
    category: "Content",
    description: "Create comprehensive documentation for Livepeer ecosystem"
  }
];

const mockGrants = [
  {
    id: 1,
    title: "Livepeer Foundation Development Grants",
    team: "PeerSurf Foundation",
    verified: true,
    type: "Grant",
    avgAmount: "$4.25k",
    maxAmount: "Up to 10k USDC",
    category: "Development"
  },
  {
    id: 2,
    title: "PeerSurf Community Grants",
    team: "PeerSurf Community",
    verified: true,
    type: "Grant",
    avgAmount: "$3.5k",
    maxAmount: "Up to 8k USDC",
    category: "Community"
  },
  {
    id: 3,
    title: "Livepeer Research Grants",
    team: "PeerSurf Research",
    verified: true,
    type: "Grant",
    avgAmount: "$5.2k",
    maxAmount: "Up to 12k USDC",
    category: "Research"
  }
];

const mockRecentEarners = [
  {
    name: "Alex Chen",
    avatar: "https://github.com/shadcn.png",
    description: "Built Livepeer analytics dashboard",
    earned: "800 USDC"
  },
  {
    name: "Sarah Kim",
    avatar: "https://github.com/shadcn.png",
    description: "Designed PeerSurf mobile UI",
    earned: "600 USDC"
  },
  {
    name: "Mike Johnson",
    avatar: "https://github.com/shadcn.png",
    description: "Wrote Livepeer ecosystem guide",
    earned: "400 USDC"
  }
];

const OpportuniesPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const categories = ["All", "Content", "Design", "Development", "Other"];
  const tabs = ["All", "Bounties", "Grants"];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg sm:text-xl">PeerSurf</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Become a Sponsor</a>
          <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Login</a>
          <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-lg">
            Sign Up
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 text-gray-300 hover:text-green-400 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6">
          {/* Hero Section - Become a Sponsor */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Become a Sponsor</h2>
                </div>
                <p className="text-green-100 mb-6 max-w-2xl text-sm sm:text-base">
                  Reach 50,000+ top-tier talent in under 5 clicks. Get high-quality work done across content, development, and design.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-lg w-full sm:w-auto">
                    Get Started
                  </Button>
                  <span className="text-green-200 text-sm">Join 1,780+ others</span>
                </div>
              </div>
            </div>
          </div>

          {/* Browse Opportunities */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">Browse Opportunities</h2>
              <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>

            {/* Primary Tabs */}
            <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-green-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    activeCategory === category
                      ? "bg-green-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Opportunities List */}
            <div className="space-y-4">
              {mockBounties.map((bounty) => (
                <Card key={bounty.id} className="bg-gray-900 border border-gray-700 p-4 sm:p-6 hover:border-green-500/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs sm:text-sm">PS</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white text-sm sm:text-base truncate">{bounty.title}</h3>
                          {bounty.verified && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm mb-2">{bounty.team}</p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                          <span className="flex items-center gap-1 text-gray-400">
                            <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                            {bounty.type}
                          </span>
                          <span className="text-green-400">{bounty.status}</span>
                          <span className="flex items-center gap-1 text-gray-400">
                            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            {bounty.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right sm:text-left">
                      <div className="text-base sm:text-lg font-bold text-green-400">{bounty.reward}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Grants Section */}
            <div className="mt-8 sm:mt-12">
              <h3 className="text-lg sm:text-xl font-bold mb-6">Grants</h3>
              <div className="space-y-4">
                {mockGrants.map((grant) => (
                  <Card key={grant.id} className="bg-gray-900 border border-gray-700 p-4 sm:p-6 hover:border-green-500/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white text-sm sm:text-base truncate">{grant.title}</h3>
                            {grant.verified && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
                          </div>
                          <p className="text-gray-400 text-xs sm:text-sm mb-2">{grant.team}</p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                            <span className="text-gray-400">{grant.type}</span>
                            <span className="text-green-400">{grant.avgAmount} Avg. Grant</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right sm:text-left">
                        <div className="flex items-center gap-1 text-base sm:text-lg font-bold text-green-400">
                          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                          {grant.maxAmount}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className={`lg:w-80 lg:border-l lg:border-gray-800 lg:p-6 ${
          showSidebar 
            ? 'fixed inset-0 z-50 bg-black/95 lg:relative lg:bg-transparent' 
            : 'hidden lg:block'
        }`}>
          {/* Mobile Sidebar Header */}
          {showSidebar && (
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="font-semibold text-white">Menu</h3>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 text-gray-300 hover:text-green-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="p-4 lg:p-0">
            {/* Become a Sponsor Card */}
            <Card className="bg-gray-900 border border-gray-700 p-4 sm:p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                <h3 className="font-semibold text-white text-sm sm:text-base">Become a Sponsor</h3>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm mb-4">
                Reach 50,000+ crypto talent from one single dashboard.
              </p>
              <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-sm">
                Get Started
              </Button>
            </Card>

            {/* Key Metrics */}
            <div className="space-y-3 sm:space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-900 border border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-400">Total Value Earned</div>
                    <div className="font-bold text-white text-sm sm:text-base">$7,654,510 USD</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-900 border border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-400">Opportunities Listed</div>
                    <div className="font-bold text-white text-sm sm:text-base">2022</div>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-4 text-sm sm:text-base">HOW IT WORKS</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-bold">1</span>
                  </div>
                  <span className="text-gray-300 text-xs sm:text-sm">Create your Profile</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-bold">2</span>
                  </div>
                  <span className="text-gray-300 text-xs sm:text-sm">Participate in Bounties & Projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-bold">3</span>
                  </div>
                  <span className="text-gray-300 text-xs sm:text-sm">Get Paid for Your Work</span>
                </div>
              </div>
            </div>

            {/* Recent Earners */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white text-sm sm:text-base">RECENT EARNERS</h3>
                <a href="#" className="text-green-400 text-xs sm:text-sm hover:underline">Leaderboard</a>
              </div>
              <div className="space-y-3">
                {mockRecentEarners.map((earner, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-900 border border-gray-700 rounded-lg">
                    <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                      <AvatarImage src={earner.avatar} />
                      <AvatarFallback className="bg-green-600 text-white text-xs">
                        {earner.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-xs sm:text-sm truncate">{earner.name}</div>
                      <div className="text-gray-400 text-xs truncate">{earner.description}</div>
                    </div>
                    <div className="text-green-400 text-xs sm:text-sm font-medium">{earner.earned}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportuniesPage;
