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
  X,
  Users,
  Target,
  TrendingUp,
  User,
  Wallet
} from "lucide-react";
import HeroCarousel from "../opportunities/HeroCarousel";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useTheme } from "../../contexts/ThemeContext";
import { getAllActiveBounties } from "../../lib/bounties";
import { getAllGrants } from "../../lib/grants";
import { getUserProfile } from "../../lib/auth";
import { listSubmissionsForOpportunity } from "../../lib/submissions";
import Navbar from "../nav-bar";
import { Skeleton } from "../ui/skeleton";

// Mock data for opportunities (keeping only RFPs)
const mockRFPs = [
  {
    id: 201,
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
    id: 202,
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
    id: 203,
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

const mockRecentSubmissions = [
  {
    name: "Alex Chen",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    description: "Wrote Viral PeerSurf Content for X (Twi",
    earned: "800 USDC"
  },
  {
    name: "Sarah Kim",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    description: "Wrote Viral PeerSurf Content for X (Twi",
    earned: "600 USDC"
  },
  {
    name: "Mike Johnson",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    description: "Wrote Livepeer ecosystem guide",
    earned: "400 USDC"
  }
];

// Sponsor carousel data
const sponsorCards = [
  {
    id: 1,
    title: "Reach 50,000+ Top Talent",
    subtitle: "Get high-quality work done across content, development, and design",
    description: "Join 1,780+ sponsors who trust PeerSurf for their project needs",
    icon: Users,
    gradient: "from-teal-600 to-teal-800",
    accent: "bg-gradient-to-r from-green-600 to-green-700",
    stats: "50K+ Talent",
    cta: "Start Hiring"
  },
  {
    id: 2,
    title: "Launch Your Project",
    subtitle: "From concept to completion with vetted crypto professionals",
    description: "Access the largest network of Web3 developers and creators",
    icon: Target,
    gradient: "from-black to-gray-900",
    accent: "bg-teal-400",
    stats: "24/7 Support",
    cta: "Get Started"
  },
  {
    id: 3,
    title: "Scale Your Impact",
    subtitle: "Build the future of decentralized media with Livepeer",
    description: "Partner with the leading video infrastructure for the open internet",
    icon: TrendingUp,
    gradient: "from-green-600 to-green-700",
    accent: "bg-black",
    stats: "Global Reach",
    cta: "Join Now"
  }
];

const OpportuniesPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const { user, profile } = useUser();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Dynamic bounties and grants from Supabase
  const [dynBounties, setDynBounties] = useState<any[]>([]);
  const [dynGrants, setDynGrants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        
        // Fetch bounties and grants in parallel
        const [bounties, grants] = await Promise.all([
          getAllActiveBounties(),
          getAllGrants()
        ]);
        
        // Process bounties with profile information
        const bountiesWithProfiles = await Promise.all(
          bounties.map(async (bounty: any) => {
            const { data: profile } = await getUserProfile(bounty.created_by);
            return {
              ...bounty,
              poster_profile: profile
            };
          })
        );
        
        // Process grants with profile information
        const grantsWithProfiles = await Promise.all(
          grants.map(async (grant: any) => {
            const { data: profile } = await getUserProfile(grant.created_by);
            return {
              ...grant,
              poster_profile: profile
            };
          })
        );
        
        // Transform bounty data to match the expected format
        const transformedBounties = await Promise.all(
          bountiesWithProfiles.map(async (bounty: any) => {
            // Fetch submission count for this bounty
            let submissionCount = 0;
            try {
              const { data } = await listSubmissionsForOpportunity(bounty.id, "Bounty");
              submissionCount = data?.length ?? 0;
            } catch (error) {
              console.error(`Error fetching submissions for bounty ${bounty.id}:`, error);
            }
            
            return {
              id: bounty.id,
              title: bounty.title,
              team: bounty.poster_profile?.full_name || bounty.poster_profile?.username || "Anonymous",
              verified: true,
              type: "Bounty",
              status: bounty.status === 'active' ? 'Active' : 'Closed',
              submissionCount,
              reward: `${bounty.budget_amount} ${bounty.budget_currency}`,
              category: bounty.category,
              description: bounty.description,
              deadline: bounty.deadline,
              created_at: bounty.created_at,
              poster_avatar: bounty.poster_profile?.avatar_url
            };
          })
        );
        
        // Transform grant data to match the expected format
        const transformedGrants = await Promise.all(
          grantsWithProfiles.map(async (grant: any) => {
            // Fetch submission count for this grant
            let submissionCount = 0;
            try {
              const { data } = await listSubmissionsForOpportunity(grant.id, "Grant");
              submissionCount = data?.length ?? 0;
            } catch (error) {
              console.error(`Error fetching submissions for grant ${grant.id}:`, error);
            }
            
            return {
              id: grant.id,
              title: grant.title,
              team: grant.poster_profile?.full_name || grant.poster_profile?.username || "Anonymous",
              verified: true,
              type: "Grant",
              status: grant.status === 'active' ? 'Active' : grant.status === 'submitted' ? 'Submitted' : 'Closed',
              submissionCount,
              reward: `${grant.amount} ${grant.currency}`, // Add reward field for detail page
              max_amount: `Up to ${grant.amount} ${grant.currency}`, // Add max_amount field for detail page
              avgAmount: `${grant.amount} ${grant.currency}`,
              maxAmount: `Up to ${grant.amount} ${grant.currency}`,
              category: grant.category,
              description: grant.overview,
              created_at: grant.created_at,
              poster_avatar: grant.poster_profile?.avatar_url
            };
          })
        );
        
        setDynBounties(transformedBounties);
        setDynGrants(transformedGrants);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
        setDynBounties([]);
        setDynGrants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  const categories = ["All", "Content", "Design", "Development", "Events", "Other"];
  const tabs = ["All", "Bounties", "RFPs"];

  // Helper function to check if a deadline date is past
  const isDeadlinePast = (deadline: string): boolean => {
    if (!deadline) return false;
    try {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      deadlineDate.setHours(0, 0, 0, 0);
      return deadlineDate < today;
    } catch (error) {
      return false;
    }
  };

  // Carousel functionality
  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % sponsorCards.length);
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextCard, 5000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <Navbar />

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6">
          {/* Hero Section */}
          <HeroCarousel
            user={user}
            profile={profile}
            sponsorCards={sponsorCards as any}
            currentCard={currentCard}
            setCurrentCard={setCurrentCard}
          />

          {/* Browse Opportunities */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Browse Opportunities
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Discover your next project from our curated collection
                </p>
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  showFilters 
                    ? "text-white bg-gradient-to-r from-green-600 to-green-700 shadow-lg shadow-green-500/25" 
                    : "text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted"
                } px-4 py-2 rounded-xl font-medium`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Filter</span>
              </button>
            </div>

            {/* Primary Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-4 py-2 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/25 transform scale-105"
                      : "text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/50 hover:scale-105"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Category Pills - Conditionally rendered based on showFilters */}
            {showFilters && (
              <div className="flex gap-3 mb-8 overflow-x-auto pb-2 animate-in slide-in-from-top-2 duration-300">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                      activeCategory === category
                        ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/25 transform scale-105"
                        : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted hover:scale-105"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {/* Opportunities List */}
            <div className="space-y-3 flex flex-col">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={`bounty-skel-${i}`} className="bg-card/50 border border-border/50 p-6 sm:p-8 rounded-2xl backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                      <div className="flex items-start gap-6 flex-1">
                        <Skeleton className="w-16 h-16 rounded-2xl" />
                        <div className="flex-1 min-w-0 space-y-3">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/3" />
                          <div className="flex gap-4">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </div>
                      </div>
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </Card>
                ))
              ) : (
                // Show opportunities based on active tab
                (() => {
                  let opportunities: any[] = [];
                  
                  // Get bounties from Supabase and RFPs from hardcoded data
                  const allOpportunities = [
                    ...dynBounties, // Always use dynamic bounties from Supabase
                    ...mockRFPs    // Always use hardcoded RFPs
                  ];

                  // Filter by tab (excluding grants)
                  const nonGrantOpportunities = allOpportunities.filter((opp: any) => opp.type !== "Grant");
                  if (activeTab === "All") {
                    opportunities = nonGrantOpportunities;
                  } else if (activeTab === "Bounties") {
                    opportunities = nonGrantOpportunities.filter((opp: any) => opp.type === "Bounty");
                  } else if (activeTab === "RFPs") {
                    opportunities = nonGrantOpportunities.filter((opp: any) => opp.type === "RFP");
                  }

                  // Filter by category if not "All"
                  if (activeCategory !== "All") {
                    opportunities = opportunities.filter((opp: any) => opp.category === activeCategory);
                  }

                  return opportunities.map((opportunity: any) => (
                <Link key={opportunity.id} to={`/opportunity/${opportunity.id}`} state={{ opportunity: { ...opportunity, type: opportunity.type || "Bounty", status: opportunity.status || "Active" } }}>
                <Card className={`group relative overflow-hidden ${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-card/50 border-border/50'} p-2 sm:p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5`}>
                  {/* Simple gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 to-green-600/0 group-hover:from-green-600/3 group-hover:to-green-600/3 transition-all duration-300" />
                  
                  <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                    <div className="flex items-start gap-6 flex-1">
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-300 group-hover:scale-105 bg-[#EAF6F2]">
                        {opportunity.type === "Bounty" ? (
                          // For bounties from Supabase, use poster's avatar
                          opportunity.poster_avatar ? (
                            <img src={opportunity.poster_avatar} alt={opportunity.team} className="w-14 h-14 rounded-full object-cover" />
                          ) : (
                            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700">
                              <span className="text-white font-bold text-sm">
                                {(opportunity.team || "A").charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )
                        ) : opportunity.team?.toLowerCase().includes('peersurf') || opportunity.issuedBy?.toLowerCase().includes('peersurf') ? (
                          <img src="onyx.png" alt="PeerSurf" className="w-14 h-14 rounded-full" />
                        ) : opportunity.team?.toLowerCase().includes('livepeer') || opportunity.issuedBy?.toLowerCase().includes('livepeer') ? (
                          <img src="livepeer.webp" alt="Livepeer" className="w-14 h-14 rounded-full" />
                        ) : (
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center`}>
                            <span className="text-white font-bold text-sm">
                              {opportunity.type === "RFP" ? "RFP" : "SP"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`font-bold ${isDark ? 'text-white' : 'text-foreground'} text-base truncate group-hover:text-green-500 transition-colors duration-300`}>
                            {opportunity.title}
                          </h3>
                          {opportunity.verified && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
                        </div>
                        <p className="text-muted-foreground text-xs mb-3">
                          {opportunity.team || opportunity.issuedBy || "Community Sponsor"}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-1 text-sm">
                          <span className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-1.5 py-1.5 rounded-full">
                            <Zap className="w-4 h-4" />
                            {opportunity.type}
                          </span> |
                          <span className="text-muted-foreground font-semibold px-3 py-1.5 rounded-full">
                            {opportunity.status || "Active"}
                          </span> |
                          {opportunity.type === "RFP" ? (
                            <span className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                              <MessageCircle className="w-4 h-4" />
                              {opportunity.comments ?? 0}
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                              <MessageCircle className="w-4 h-4" />
                               {opportunity.submissionCount}
                            </span>
                          )} 
                          {opportunity.deadline && (
                            <span className={`font-semibold px-3 py-1.5 rounded-full ${
                              isDeadlinePast(opportunity.deadline) 
                                ? "text-red-500 opacity-70" 
                                : "text-muted-foreground"
                            }`}>
                              Due: {opportunity.deadline}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right sm:text-left">
                      <div className="text-base font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
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

          {/* Grants Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Grants
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Discover funding opportunities for your projects
                </p>
              </div>
            </div>

            {/* Grants List */}
            <div className="space-y-4 flex flex-col">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={`grant-skel-${i}`} className="bg-card/50 border border-border/50 p-6 sm:p-8 rounded-2xl backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                      <div className="flex items-start gap-6 flex-1">
                        <Skeleton className="w-16 h-16 rounded-2xl" />
                        <div className="flex-1 min-w-0 space-y-3">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/3" />
                          <div className="flex gap-4">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-12" />
                          </div>
                        </div>
                      </div>
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </Card>
                ))
              ) : (
                (() => {
                  // Get grants from Supabase
                  const grants = dynGrants;

                  // Filter by category if not "All"
                  let filteredGrants = grants;
                  if (activeCategory !== "All") {
                    filteredGrants = grants.filter((grant: any) => grant.category === activeCategory);
                  }

                  return filteredGrants.map((grant: any) => (
                    <Link key={grant.id} to={`/opportunity/${grant.id}`} state={{ opportunity: { ...grant, type: "Grant", status: "Active" } }}>
                      <Card className={`group relative overflow-hidden ${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-card/50 border-border/50'} p-2 sm:p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5`}>
                        {/* Simple gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/3 group-hover:to-purple-600/3 transition-all duration-300" />
                        
                        <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                          <div className="flex items-start gap-6 flex-1">
                            <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-300 group-hover:scale-105 bg-[#EAF6F2]">
                              {grant.poster_avatar ? (
                                <img src={grant.poster_avatar} alt={grant.team} className="w-14 h-14 rounded-full object-cover" />
                              ) : (
                                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700">
                                  <span className="text-white font-bold text-sm">
                                    {(grant.team || "G").charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-foreground'} text-base truncate group-hover:text-purple-500 transition-colors duration-300`}>
                                  {grant.title}
                                </h3>
                                {grant.verified && <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />}
                              </div>
                              <p className="text-muted-foreground text-xs mb-3">
                                {grant.team || "Community Sponsor"}
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-1 text-sm">
                                <span className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-1.5 py-1.5 rounded-full">
                                  <Zap className="w-4 h-4" />
                                  Grant
                                </span> |
                                <span className="text-muted-foreground font-semibold px-3 py-1.5 rounded-full">
                                  Active
                                </span> |
                                <span className="text-muted-foreground px-3 py-1.5 rounded-full">
                                  {grant.avgAmount} Avg. Grant
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right sm:text-left">
                            <div className="text-base font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                              {grant.maxAmount || grant.avgAmount || ""}
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
        <div className={`lg:w-80 lg:border-l ${isDark ? 'lg:border-gray-700/50' : 'lg:border-border/50'} lg:p-6 ${
          showSidebar 
            ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-xl lg:relative lg:bg-transparent' 
            : 'hidden lg:block'
        }`}>
          {/* Mobile Sidebar Header */}
          {showSidebar && (
            <div className={`lg:hidden flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-800' : 'border-border'}`}>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-foreground'}`}>Menu</h3>
              <button
                onClick={() => setShowSidebar(false)}
                className={`p-2 ${isDark ? 'text-gray-300 hover:text-green-400' : 'text-muted-foreground hover:text-primary'} transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="p-4 lg:p-0">
            {/* Become a Sponsor / Sponsorship Card */}
            {loading ? (
              <Card className="bg-card/50 border border-border/50 p-6 sm:p-8 mb-8 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="w-8 h-8 rounded-xl" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
                <Skeleton className="h-4 w-3/4 mb-3" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </Card>
            ) : (
              <Card className={`group relative overflow-hidden ${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-card/50 border-border/50'} p-4 sm:p-6 mb-8 rounded-2xl backdrop-blur-sm border transition-all duration-500 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/10 hover:scale-[1.02]`}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-green-600/0 group-hover:from-green-600/5 group-hover:to-green-600/10 transition-all duration-500" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-foreground'} text-base`}>
                      {profile?.role === 'SPE' ? 'Sponsorship' : 'Become a Sponsor'}
                    </h3>
                </div>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  Create your profile -- Complete your bio -- Post your opportunities 
                </p>
                  <Button 
                    onClick={() => navigate(profile?.role === 'SPE' ? '/profile' : '/auth?mode=signup&role=SPE')} 
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25"
                  >
                  Get Started
                </Button>
                </div>
              </Card>
            )}

            {/* Key Metrics */}
            <div className="space-y-4 mb-8">
              {loading ? (
                <>
                  <Card className="bg-card/50 border border-border/50 p-4 sm:p-6 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-5 w-40" />
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-card/50 border border-border/50 p-4 sm:p-6 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                  </Card>
                </>
              ) : (
                <>
                  <div className={`group flex items-center justify-between p-4 sm:p-6 ${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-card/50 border-border/50'} rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-300">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-base text-muted-foreground font-medium">Total Value Earned</div>
                        <div className={`font-bold ${isDark ? 'text-white' : 'text-foreground'} text-sm bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent`}>
                           USD
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`group flex items-center justify-between p-4 sm:p-6 ${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-card/50 border-border/50'} rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-base text-muted-foreground font-medium">Opportunities Listed</div>
                        <div className={`font-bold ${isDark ? 'text-white' : 'text-foreground'} text-sm bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent`}>
                          {loading ? "..." : 
                            dynBounties.length + 
                            dynGrants.length + 
                            mockRFPs.length
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* How It Works */}
            <div className="mb-8">
              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-foreground'} mb-6 text-sm bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent`}>
                HOW IT WORKS
              </h3>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`how-${i}`} className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative">
                  {/* Connecting line */}
                  <div className="absolute left-6 top-12 bottom-0 w-px bg-muted-foreground/20"></div>
                  
                  <div className="space-y-2">
                    <div className="group flex items-center gap-4 p-2 rounded-xl hover:bg-muted/30 transition-all duration-300 relative shadow-sm border-2 border-gray-200">
                      <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <span className="text-muted-foreground text-sm font-medium group-hover:text-foreground transition-colors duration-300">
                        Create your Profile
                      </span>
                    </div>
                    <div className="group flex items-center gap-4 p-2 rounded-xl hover:bg-muted/30 transition-all duration-300 relative shadow-sm border-2 border-gray-200">
                      <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <span className="text-muted-foreground text-sm font-medium group-hover:text-foreground transition-colors duration-300">
                        Participate in Bounties & Projects
                      </span>
                    </div>
                    <div className="group flex items-center gap-4 p-2 rounded-xl hover:bg-muted/30 transition-all duration-300 relative shadow-sm border-2 border-gray-200">
                      <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Wallet className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <span className="text-muted-foreground text-sm font-medium group-hover:text-foreground transition-colors duration-300">
                        Get Paid for Your Work
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Submissions */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-foreground'} text-sm bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent`}>
                  RECENT SUBMISSIONS
                </h3>
                <Link to="/opportunities#leaderboard" className="text-green-400 text-sm font-medium hover:text-green-300 transition-colors duration-300 hover:underline">
                  Leaderboard
                </Link>
              </div>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`earner-${i}`} className="flex items-center gap-4 p-4 bg-card/50 border border-border/50 rounded-2xl backdrop-blur-sm">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div className="flex-1 min-w-0 space-y-3">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {mockRecentSubmissions.map((submission, index) => (
                    <div key={index} className={`group flex items-center gap-4 p-4 ${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-card/50 border-border/50'} rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 hover:scale-[1.02]`}>
                      <Avatar className="w-12 h-12 ring-2 ring-green-500/20 group-hover:ring-green-500/40 transition-all duration-300">
                        <AvatarImage src={submission.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-bold">
                          {submission.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold ${isDark ? 'text-white' : 'text-foreground'} text-xs truncate group-hover:text-green-400 transition-colors duration-300`}>
                            {submission.name}
                        </div>
                        <div className="text-muted-foreground text-xs truncate">{submission.description}</div>
                      </div>
                      {/* <div className="text-green-400 text-xs font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                        {submission.earned}
                      </div> */}
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