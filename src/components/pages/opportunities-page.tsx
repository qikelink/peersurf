import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  Filter, 
  MessageCircle, 
  CheckCircle,
  Briefcase,
  Zap,
  DollarSign,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { listOpportunities } from "../../lib/opportunities";
import Navbar from "../nav-bar";
import { Skeleton } from "../ui/skeleton";

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

const mockRFPs = [
  {
    id: 1,
    title: "Livepeer Explorer Restoration & Modernization",
    team: "Livepeer Foundation",
    verified: true,
    type: "RFP",
    status: "Active",
    comments: 15,
    reward: "Up to $50k USDC",
    category: "Development",
    description: "Restore the Livepeer Explorer to a secure, maintainable, and high-performance state while laying the groundwork for new network-wide data and governance dashboards.",
    fullDescription: `Restore the Livepeer Explorer to a secure, maintainable, and high-performance state while laying the groundwork for new network-wide data and governance dashboards.

The Explorer is the primary entry point for orchestrators, delegators, developers, and gateways. However, since December 2023 lack of ownership has accumulated significant technical debt:

• Outdated dependencies in the Explorer and design system, fragile under Node 20, break on updates and could lead to security risks, undermining long-term maintainability.
• Duplicated/obsolete code and missing contribution infrastructure (guidelines, CI/tests, stubs), making contributions slow and error-prone.
• Inefficient data fetching (e.g. Infura/Graph duplication), creating performance issues.
• A backlog of unmerged PRs and unresolved bugs (e.g., broken migration widget, UI inconsistencies, incorrectly displayed data).

Success means that within four months the Explorer is:
• Clean, well tested, with automated tests and continuous integration pipelines
• Free of critical bugs and stale pull requests
• Running on up-to-date, secure dependencies
• Improved in performance with faster page loads
• Equipped with a new voting-transparency feature
• Backed by a clear 6-month roadmap and dedicated maintainer team`,
    deadline: "2025-09-24",
    contact: "Rick Staa",
    issuedBy: "Livepeer Foundation"
  },
  {
    id: 2,
    title: "Livepeer Documentation Restructure & Modernization",
    team: "Livepeer Foundation",
    verified: true,
    type: "RFP",
    status: "Active",
    comments: 8,
    reward: "Up to $30k USDC",
    category: "Content",
    description: "Restructure, refresh, and modernize Livepeer's documentation so that it is stakeholder-focused, AI-first, and future-proofed.",
    fullDescription: `Restructure, refresh, and modernize Livepeer's documentation so that it is stakeholder-focused, AI-first, and future-proofed. It should cater to the core personas of the Livepeer project: developers, delegators, gateway operators and orchestrators.

Current Livepeer docs suffer from:
• Complicated onboarding: User journeys are hidden behind toggles instead of clear entry points
• Outdated or inconsistent content: Deprecated APIs, stale references, incomplete AI coverage
• Brand & duplication: Studio-specific guidance mixed into core docs
• Weak site integration: Poor linkage between website, explorer, governance portal, and docs

Success is a single-source-of-truth documentation system that:
• Leads with clear stakeholder-focused onboarding and goal-oriented entry points
• Cleanly separates AI Jobs vs Transcoding Jobs while surfacing cross-cutting resources
• Fully deprecates Studio content with redirects and zero broken links
• Provides AI-first documentation: semantically structured, LLM-readable, with embedded natural language search/assistant
• Consolidates changelogs and introduces versioning / deprecation tracking
• Establishes a style guide, contribution model, and ownership playbook for consistency`,
    deadline: "2025-09-24",
    contact: "Rich O'Grady",
    issuedBy: "Livepeer Foundation"
  },
  {
    id: 3,
    title: "Devconnect Assembly - Buenos Aires",
    team: "Livepeer Foundation",
    verified: true,
    type: "RFP",
    status: "Active",
    comments: 4,
    reward: "Budget TBD",
    category: "Events",
    description: "Deliver a half-day Assembly during Devconnect Buenos Aires (Nov 17–22, 2025) that positions Livepeer as the video, AI, and media layer of the open internet.",
    fullDescription: `Deliver a half-day Assembly during Devconnect Buenos Aires (Nov 17–22, 2025) that positions Livepeer as the video, AI, and media layer of the open internet.

The event should be participatory and not panel-driven. It will convene 60–80 curated attendees selected by application and invitation — creators, developers, founders, researchers, and cultural practitioners — to explore the future of media, AI, and video.

Key Deliverables:
• Venue & Production Management - Secure suitable venue, manage AV setup, catering, and branding
• Run-of-Show & Facilitation Support - Design participant flow and coordinate structured discussions
• Attendee Experience & Integration - Manage invitations, check-in, and participant flow
• Partner Coordination & Integration - Ensure strong ecosystem partner representation
• Post-Event Wrap & Documentation - Capture outputs and create content package

The event does not have a full-time Events team nor has a presence in Argentina. We need a production partner who can bring together suppliers locally to execute the event, whilst connecting us with adjacent ecosystems.

Timeline:
• Proposal Deadline: Wednesday, Oct 8, 2025
• Decision Announced: Friday, Oct 10, 2025
• Project Start: Monday, Oct 13, 2025
• Event Date: Wednesday, Nov 19, 2025
• Completion: Friday, Dec 5, 2025`,
    deadline: "2025-10-08",
    contact: "Nick Hollins",
    issuedBy: "Livepeer Foundation"
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
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { user, profile } = useUser();
  const navigate = useNavigate();

  // Dynamic opportunities from Supabase
  const [dynBounties, setDynBounties] = useState<any[]>([]);
  const [dynGrants, setDynGrants] = useState<any[]>([]);
  const [dynRFPs, setDynRFPs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const { data } = await listOpportunities();
        const all = data || [];
        setDynBounties(all.filter((o: any) => o.type === "Bounty"));
        setDynGrants(all.filter((o: any) => o.type === "Grant"));
        setDynRFPs(all.filter((o: any) => o.type === "RFP"));
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const categories = ["All", "Content", "Design", "Development", "Events", "Other"];
  const tabs = ["All", "Bounties", "Grants", "RFPs"];


  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <Navbar />

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6">
          {/* Hero Section - Conditional based on role */}
          {(!profile?.role || profile?.role === 'SPE') ? (
            <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 rounded-sm p-6 sm:p-8 mb-6 sm:mb-8">
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-foreground/5 rounded-full blur-2xl animate-float" />
              <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all duration-700 ease-out">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-float" />
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{profile?.role === 'SPE' ? 'Sponsorship' : 'Become a Sponsor'}</h2>
                  </div>
                  <p className="text-green-100 mb-6 max-w-2xl text-sm sm:text-base">
                    Reach 50,000+ top-tier talent in under 5 clicks. Get high-quality work done across content, development, and design.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Link to={profile?.role === 'SPE' ? '/sponsor' : '/auth?mode=signup&role=SPE'} className="w-full sm:w-auto">
                      <Button className="bg-foreground text-background hover:opacity-90 px-6 py-3 rounded-lg w-full sm:w-auto">
                        Get Started
                      </Button>
                    </Link>
                    <span className="text-green-200 text-sm">Join 1,780+ others</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8">
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-foreground/5 rounded-full blur-2xl animate-float" />
              <div className="relative flex items-start justify-between gap-6 transition-all duration-700 ease-out">
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{`Welcome back, ${profile?.username || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'}`}</h2>
                  <p className="text-green-100 mb-6 max-w-2xl text-sm sm:text-base">We're so glad to have you on Earn</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/80">
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">Opportunities curated for talent</span>
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">New listings daily</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Browse Opportunities */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">Browse Opportunities</h2>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 transition-colors ${
                  showFilters 
                    ? "text-green-400 bg-green-400/10" 
                    : "text-muted-foreground hover:text-primary"
                } px-3 py-2 rounded-lg`}
              >
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
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Category Pills - Conditionally rendered based on showFilters */}
            {showFilters && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 animate-in slide-in-from-top-2 duration-200">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      activeCategory === category
                        ? "bg-green-600 text-white"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {/* Opportunities List */}
            <div className="space-y-4 flex flex-col">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={`bounty-skel-${i}`} className="bg-card border border-border p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <Skeleton className="w-12 h-12 rounded-lg" />
                        <div className="flex-1 min-w-0 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/3" />
                          <div className="flex gap-3">
                            <Skeleton className="h-3 w-14" />
                            <Skeleton className="h-3 w-10" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      </div>
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </Card>
                ))
              ) : (
                // Show opportunities based on active tab
                (() => {
                  let opportunities: any[] = [];
                  if (activeTab === "All") {
                    opportunities = [
                      ...(dynBounties.length ? dynBounties : mockBounties),
                      ...(dynGrants.length ? dynGrants : mockGrants),
                      ...(dynRFPs.length ? dynRFPs : mockRFPs)
                    ];
                  } else if (activeTab === "Bounties") {
                    opportunities = dynBounties.length ? dynBounties : mockBounties;
                  } else if (activeTab === "Grants") {
                    opportunities = dynGrants.length ? dynGrants : mockGrants;
                  } else if (activeTab === "RFPs") {
                    opportunities = dynRFPs.length ? dynRFPs : mockRFPs;
                  }

                  // Filter by category if not "All"
                  if (activeCategory !== "All") {
                    opportunities = opportunities.filter((opp: any) => opp.category === activeCategory);
                  }

                  return opportunities.map((opportunity: any) => (
                <Link key={opportunity.id} to={`/opportunity/${opportunity.id}`} state={{ opportunity: { ...opportunity, type: opportunity.type || "Bounty", status: opportunity.status || "Active" } }}>
                <Card className="bg-gray-900 border border-gray-700 p-4 sm:p-6 hover:border-green-500/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        opportunity.type === "RFP" 
                          ? "bg-gradient-to-br from-orange-600 to-orange-800" 
                          : opportunity.type === "Grant"
                          ? "bg-gradient-to-br from-purple-600 to-purple-800"
                          : "bg-gradient-to-br from-green-600 to-green-800"
                      }`}>
                        <span className="text-white font-bold text-xs sm:text-sm">
                          {opportunity.type === "RFP" ? "RFP" : opportunity.team ? "PS" : "SP"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white text-sm sm:text-base truncate">{opportunity.title}</h3>
                          {opportunity.verified && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
                        </div>
                        <p className="text-muted-foreground text-xs sm:text-sm mb-2">{opportunity.team || opportunity.issuedBy || "Community Sponsor"}</p>
                        
                        {/* Description */}
                        <div className="mb-2">
                          <p className="text-muted-foreground text-xs sm:text-sm">
                            {opportunity.description}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                            {opportunity.type}
                          </span>
                          <span className="text-green-400">{opportunity.status || "Active"}</span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            {opportunity.comments ?? 0}
                          </span>
                          {opportunity.deadline && (
                            <span className="text-orange-400">
                              Due: {opportunity.deadline}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right sm:text-left">
                      <div className="text-base sm:text-lg font-bold text-green-400">
                        {opportunity.reward || opportunity.maxAmount || opportunity.avgAmount || ""}
                      </div>
                    </div>
                  </div>
                </Card>
                </Link>
                  ));
                })()
              )}
            </div>

          </div>
        </div>

        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className={`lg:w-80 lg:border-l lg:border-gray-800 lg:p-6 ${
          showSidebar 
            ? 'fixed inset-0 z-50 bg-background/95 lg:relative lg:bg-transparent' 
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
            {/* Become a Sponsor / Sponsorship Card */}
            {loading ? (
              <Card className="bg-card border border-border p-4 sm:p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="w-6 h-6 rounded" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-3 w-3/4 mb-2" />
                <Skeleton className="h-3 w-2/3 mb-4" />
                <Skeleton className="h-9 w-full rounded-sm" />
              </Card>
            ) : (
              <Card className="bg-gray-900 border border-gray-700 p-4 sm:p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                  <h3 className="font-semibold text-white text-sm sm:text-base">{profile?.role === 'SPE' ? 'Sponsorship' : 'Become a Sponsor'}</h3>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm mb-4">
                  Reach 50,000+ crypto talent from one single dashboard.
                </p>
                <Button onClick={() => navigate(profile?.role === 'SPE' ? '/sponsor' : '/auth?mode=signup&role=SPE')} className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-sm">
                  Get Started
                </Button>
              </Card>
            )}

            {/* Key Metrics */}
            <div className="space-y-3 sm:space-y-4 mb-6">
              {loading ? (
                <>
                  <Card className="bg-card border border-border p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-card border border-border p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-36" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </Card>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-900 border border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Total Value Earned</div>
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
                        <div className="text-xs sm:text-sm text-muted-foreground">Opportunities Listed</div>
                        <div className="font-bold text-white text-sm sm:text-base">
                          {loading ? "..." : 
                            (dynBounties.length || mockBounties.length) + 
                            (dynGrants.length || mockGrants.length) + 
                            (dynRFPs.length || mockRFPs.length)
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* How It Works */}
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-4 text-sm sm:text-base">HOW IT WORKS</h3>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`how-${i}`} className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-bold">1</span>
                    </div>
                    <span className="text-muted-foreground text-xs sm:text-sm">Create your Profile</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-bold">2</span>
                    </div>
                    <span className="text-muted-foreground text-xs sm:text-sm">Participate in Bounties & Projects</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-bold">3</span>
                    </div>
                    <span className="text-muted-foreground text-xs sm:text-sm">Get Paid for Your Work</span>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Earners */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white text-sm sm:text-base">RECENT EARNERS</h3>
                <Link to="/home#leaderboard" className="text-green-400 text-xs sm:text-sm hover:underline">Leaderboard</Link>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`earner-${i}`} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1 min-w-0 space-y-2">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                      <Skeleton className="h-3 w-12" />
                    </div>
                  ))}
                </div>
              ) : (
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
                        <div className="text-muted-foreground text-xs truncate">{earner.description}</div>
                      </div>
                      <div className="text-green-400 text-xs sm:text-sm font-medium">{earner.earned}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportuniesPage;