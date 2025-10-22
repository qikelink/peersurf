import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star, 
  Search, 
  TrendingUp, 
  Users, 
  DollarSign,
  Calendar,
  Award
} from 'lucide-react';
import Navbar from '../nav-bar';
import { Skeleton } from '../ui/skeleton';

// Simplified talent data
type TalentCategory = 'Developers' | 'Content Creators' | 'Others';

const mockTalentData = [
  { id: 1, rank: 1, category: 'Developers' as TalentCategory, name: "Alex Chen", username: "@alexchen", avatar: "https://github.com/shadcn.png", totalEarnings: 15420, projectsCompleted: 23, successRate: 98, tier: "Diamond", tierColor: "from-blue-500 to-purple-600" },
  { id: 2, rank: 2, category: 'Content Creators' as TalentCategory, name: "Sarah Kim", username: "@sarahkim", avatar: "https://github.com/shadcn.png", totalEarnings: 12850, projectsCompleted: 19, successRate: 95, tier: "Platinum", tierColor: "from-gray-400 to-gray-600" },
  { id: 3, rank: 3, category: 'Developers' as TalentCategory, name: "Mike Johnson", username: "@mikej", avatar: "https://github.com/shadcn.png", totalEarnings: 11200, projectsCompleted: 17, successRate: 92, tier: "Gold", tierColor: "from-yellow-500 to-orange-500" },
  { id: 4, rank: 4, category: 'Content Creators' as TalentCategory, name: "Emma Rodriguez", username: "@emmar", avatar: "https://github.com/shadcn.png", totalEarnings: 9850, projectsCompleted: 15, successRate: 88, tier: "Gold", tierColor: "from-yellow-500 to-orange-500" },
  { id: 5, rank: 5, category: 'Developers' as TalentCategory, name: "David Park", username: "@davidp", avatar: "https://github.com/shadcn.png", totalEarnings: 8750, projectsCompleted: 14, successRate: 85, tier: "Silver", tierColor: "from-gray-300 to-gray-500" },
  { id: 6, rank: 6, category: 'Others' as TalentCategory, name: "Lisa Wang", username: "@lisaw", avatar: "https://github.com/shadcn.png", totalEarnings: 7200, projectsCompleted: 12, successRate: 90, tier: "Silver", tierColor: "from-gray-300 to-gray-500" },
  { id: 7, rank: 7, category: 'Developers' as TalentCategory, name: "James Wilson", username: "@jamesw", avatar: "https://github.com/shadcn.png", totalEarnings: 6800, projectsCompleted: 11, successRate: 87, tier: "Silver", tierColor: "from-gray-300 to-gray-500" },
  { id: 8, rank: 8, category: 'Content Creators' as TalentCategory, name: "Maria Garcia", username: "@mariag", avatar: "https://github.com/shadcn.png", totalEarnings: 6200, projectsCompleted: 10, successRate: 83, tier: "Bronze", tierColor: "from-amber-600 to-amber-800" },
  { id: 9, rank: 9, category: 'Others' as TalentCategory, name: "Tom Brown", username: "@tomb", avatar: "https://github.com/shadcn.png", totalEarnings: 5800, projectsCompleted: 9, successRate: 89, tier: "Bronze", tierColor: "from-amber-600 to-amber-800" },
  { id: 10, rank: 10, category: 'Developers' as TalentCategory, name: "Anna Lee", username: "@annal", avatar: "https://github.com/shadcn.png", totalEarnings: 5400, projectsCompleted: 8, successRate: 86, tier: "Bronze", tierColor: "from-amber-600 to-amber-800" }
];

const seasonStats = {
  totalParticipants: 2847,
  totalEarnings: 2847500,
  averageEarnings: 1000,
  topEarner: "Alex Chen",
  topEarnings: 15420,
  seasonStart: "2024-01-01",
  seasonEnd: "2024-12-31",
  currentWeek: 23,
  seasonNumber: 3,
  nextReset: "2025-01-01",
  daysUntilReset: 45,
  previousSeasonWinner: "Sarah Kim",
  previousSeasonEarnings: 18950,
  competitionActive: true,
  resetFrequency: "Quarterly"
};

const TalentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('earnings');
  const [filterTier, setFilterTier] = useState('All');
  const [activeCategory, setActiveCategory] = useState<TalentCategory>('Developers');
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const tiers = ['All', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'];

  const filteredTalent = mockTalentData.filter(talent => {
    const matchesSearch = talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talent.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'All' || talent.tier === filterTier;
    const matchesCategory = talent.category === activeCategory;
    return matchesSearch && matchesTier && matchesCategory;
  });

  const sortedTalent = [...filteredTalent].sort((a, b) => {
    switch (sortBy) {
      case 'earnings':
        return b.totalEarnings - a.totalEarnings;
      case 'projects':
        return b.projectsCompleted - a.projectsCompleted;
      case 'success':
        return b.successRate - a.successRate;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return a.rank - b.rank;
    }
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-bold">{rank}</span>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-20 bg-gradient-to-br from-green-600/5 to-blue-600/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
            <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Season Leaderboard
            </h1>
            <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
          </div>

          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
            Discover the top talent in the Livepeer ecosystem
          </p>

          {/* Season Info - Mobile Responsive */}
          <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8">
            <div className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-gradient-to-r from-green-600/20 to-green-800/20 border border-green-500/30 rounded-full">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
              <span className="text-xs md:text-sm font-medium">Season {seasonStats.seasonNumber}</span>
            </div>
            <div className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-gradient-to-r from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-full">
              <Users className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
              <span className="text-xs md:text-sm font-medium">{seasonStats.totalParticipants.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-gradient-to-r from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-full">
              <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-purple-500" />
              <span className="text-xs md:text-sm font-medium">{formatCurrency(seasonStats.totalEarnings)}</span>
            </div>
            <div className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-gradient-to-r from-orange-600/20 to-orange-800/20 border border-orange-500/30 rounded-full">
              <Trophy className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
              <span className="text-xs md:text-sm font-medium">{seasonStats.daysUntilReset} days</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Category Tabs + Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0 space-y-4">
            <Card className="p-4 bg-gradient-to-br from-green-600/10 to-blue-600/10 border-green-500/20">
              <h3 className="font-semibold mb-3">Leaderboards</h3>
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
                {(['Developers','Content Creators','Others'] as TalentCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                      activeCategory === cat
                        ? 'bg-green-600 text-white'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Filters</h3>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search talent..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm"
                >
                  <option value="earnings">Sort by Earnings</option>
                  <option value="projects">Sort by Projects</option>
                  <option value="success">Sort by Success Rate</option>
                  <option value="name">Sort by Name</option>
                </select>
                {/* Desktop sidebar: vertical list; hidden on mobile */}
                <div className="hidden lg:flex flex-col gap-2">
                  {tiers.map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setFilterTier(tier)}
                      className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-green-400 ${
                        filterTier === tier
                          ? 'bg-green-600 text-white shadow'
                          : 'bg-muted text-muted-foreground hover:text-foreground hover:border-green-200'
                      }`}
                      style={{minHeight: 36}}
                      type="button"
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Column */}
          <div className="flex-1">
            {/* Stats Cards - Mobile Responsive */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8" >
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="p-3 md:p-6" >
                    <Skeleton className="h-3 md:h-4 w-16 md:w-24 mb-2" />
                    <Skeleton className="h-6 md:h-8 w-20 md:w-32" />
                  </Card>
                ))
              ) : (
                <>
                  <Card className="p-3 md:p-6 bg-gradient-to-br from-green-600/10 to-green-800/10 border-green-500/20" >
                    <div className="flex items-center gap-2 mb-1 md:mb-2">
                      <Trophy className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      <span className="text-xs md:text-sm font-medium text-muted-foreground">Top Earner</span>
                    </div>
                    <div className="text-lg md:text-2xl font-bold text-foreground truncate">{seasonStats.topEarner}</div>
                    <div className="text-xs md:text-sm text-green-500">{formatCurrency(seasonStats.topEarnings)}</div>
                  </Card>

                  <Card className="p-3 md:p-6 bg-gradient-to-br from-blue-600/10 to-blue-800/10 border-blue-500/20" >
                    <div className="flex items-center gap-2 mb-1 md:mb-2">
                      <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                      <span className="text-xs md:text-sm font-medium text-muted-foreground">Participants</span>
                    </div>
                    <div className="text-lg md:text-2xl font-bold text-foreground">{seasonStats.totalParticipants.toLocaleString()}</div>
                    <div className="text-xs md:text-sm text-blue-500">+12% this month</div>
                  </Card>

                  <Card className="p-3 md:p-6 bg-gradient-to-br from-purple-600/10 to-purple-800/10 border-purple-500/20" >
                    <div className="flex items-center gap-2 mb-1 md:mb-2">
                      <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                      <span className="text-xs md:text-sm font-medium text-muted-foreground">Total Earnings</span>
                    </div>
                    <div className="text-lg md:text-2xl font-bold text-foreground">{formatCurrency(seasonStats.totalEarnings)}</div>
                    <div className="text-xs md:text-sm text-purple-500">+8% this week</div>
                  </Card>

                  <Card className="p-3 md:p-6 bg-gradient-to-br from-orange-600/10 to-orange-800/10 border-orange-500/20" >
                    <div className="flex items-center gap-2 mb-1 md:mb-2">
                      <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                      <span className="text-xs md:text-sm font-medium text-muted-foreground">Avg. Earnings</span>
                    </div>
                    <div className="text-lg md:text-2xl font-bold text-foreground">{formatCurrency(seasonStats.averageEarnings)}</div>
                    <div className="text-xs md:text-sm text-orange-500">Per participant</div>
                  </Card>
                </>
              )}
            </div>

            {/* Search and Filters - top row (mobile-visible) */}
            <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6 lg:hidden" >
              <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search talent..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-card border border-border rounded-lg text-sm min-w-[140px]"
                >
                  <option value="earnings">Sort by Earnings</option>
                  <option value="projects">Sort by Projects</option>
                  <option value="success">Sort by Success Rate</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
              {/* Mobile: horizontal scrollable chip row; hidden on desktop */}
              <div className="flex lg:hidden overflow-x-auto pb-1 gap-2 -mx-1">
                {tiers.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setFilterTier(tier)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-green-400 ${
                      filterTier === tier
                        ? 'bg-green-600 text-white shadow'
                        : 'bg-muted text-muted-foreground border border-gray-300 hover:text-foreground'
                    }`}
                    style={{minWidth: 64, minHeight: 36}}
                    type="button"
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Leaderboard - Mobile Responsive */}
            <div className="space-y-3 md:space-y-4" >
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <Card key={i} className="p-4"  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </Card>
                ))
              ) : (
                sortedTalent.map((talent) => (
                  <Card key={talent.id} className="p-3 md:p-4 hover:bg-muted/30 transition-colors"  >
                    <div className="flex items-center gap-3">
                      {/* Rank */}
                      <div className="flex items-center gap-2 min-w-[60px]">
                        {getRankIcon(talent.rank)}
                        <span className="font-bold text-sm md:text-base">{talent.rank}</span>
                      </div>
                      
                      {/* Avatar & Name */}
                      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                        <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
                          <AvatarImage src={talent.avatar} />
                          <AvatarFallback className="bg-green-600 text-white text-xs">
                            {talent.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-foreground text-sm md:text-base truncate">{talent.name}</div>
                          <div className="text-xs md:text-sm text-muted-foreground truncate">{talent.username}</div>
                        </div>
                      </div>
                      
                      {/* Tier */}
                      <div className="hidden sm:block">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${talent.tierColor} text-white`}>
                          <Star className="w-3 h-3" />
                          {talent.tier}
                        </div>
                      </div>
                      
                      {/* Stats - Desktop */}
                      <div className="hidden lg:flex items-center gap-4 text-sm">
                        <div className="text-right">
                          <div className="font-bold text-green-500">{formatCurrency(talent.totalEarnings)}</div>
                          <div className="text-xs text-muted-foreground">Earnings</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{talent.projectsCompleted}</div>
                          <div className="text-xs text-muted-foreground">Projects</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-500">{talent.successRate}%</div>
                          <div className="text-xs text-muted-foreground">Success</div>
                        </div>
                      </div>
                      
                      {/* Stats - Mobile */}
                      <div className="lg:hidden text-right">
                        <div className="font-bold text-green-500 text-sm">{formatCurrency(talent.totalEarnings)}</div>
                        <div className="text-xs text-muted-foreground">{talent.projectsCompleted} projects</div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Call to Action - Mobile Responsive */}
        <div className="mt-8 md:mt-12 text-center" >
          <Card className="p-4 md:p-8 bg-gradient-to-r from-green-600/10 to-blue-600/10 border-green-500/20">
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4" >Ready to Join the Competition?</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto" >
              Start contributing to the Livepeer ecosystem and compete for the top spot in Season {seasonStats.seasonNumber}.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center" >
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-6 md:px-8 py-2 md:py-3 text-sm md:text-base">
                Browse Opportunities
              </Button>
              <Button variant="outline" className="px-6 md:px-8 py-2 md:py-3 text-sm md:text-base">
                Create Profile
              </Button>
            </div>
            <div className="mt-3 md:mt-4 text-xs md:text-sm text-muted-foreground" >
              Next reset: {new Date(seasonStats.nextReset).toLocaleDateString()} ({seasonStats.daysUntilReset} days)
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TalentPage;
