import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
   
  Crown, 
  Medal, 
  Star, 
   
   
  Users, 
 
  Calendar,
  Award,
 
  Bookmark,
  Gift,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import Navbar from '../nav-bar';
import { Skeleton } from '../ui/skeleton';
import Footer from '../footer';
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from '../ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { supabase } from '../../lib/supabase';
import type { Profile } from '../../lib/supabase';
import { useUser } from '../../contexts/UserContext';

// Simplified talent data
type TalentCategory = 'Referral Program' | 'Developers' | 'Content Creators' | 'Others';

const mockTalentData = [
  { id: 1, rank: 1, category: 'Developers' as TalentCategory, name: "Alex Chen", username: "@alexchen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", totalEarnings: 15420, projectsCompleted: 23, successRate: 98, tier: "Diamond", tierColor: "from-blue-500 to-purple-600" },
  { id: 2, rank: 2, category: 'Content Creators' as TalentCategory, name: "Sarah Kim", username: "@sarahkim", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face", totalEarnings: 12850, projectsCompleted: 19, successRate: 95, tier: "Platinum", tierColor: "from-gray-400 to-gray-600" },
  { id: 3, rank: 3, category: 'Developers' as TalentCategory, name: "Mike Johnson", username: "@mikej", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", totalEarnings: 11200, projectsCompleted: 17, successRate: 92, tier: "Gold", tierColor: "from-yellow-500 to-orange-500" },
  { id: 4, rank: 4, category: 'Content Creators' as TalentCategory, name: "Emma Rodriguez", username: "@emmar", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", totalEarnings: 9850, projectsCompleted: 15, successRate: 88, tier: "Gold", tierColor: "from-yellow-500 to-orange-500" },
  { id: 5, rank: 5, category: 'Developers' as TalentCategory, name: "David Park", username: "@davidp", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", totalEarnings: 8750, projectsCompleted: 14, successRate: 85, tier: "Silver", tierColor: "from-gray-300 to-gray-500" },
  { id: 6, rank: 6, category: 'Others' as TalentCategory, name: "Lisa Wang", username: "@lisaw", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", totalEarnings: 7200, projectsCompleted: 12, successRate: 90, tier: "Silver", tierColor: "from-gray-300 to-gray-500" },
  { id: 7, rank: 7, category: 'Developers' as TalentCategory, name: "James Wilson", username: "@jamesw", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", totalEarnings: 6800, projectsCompleted: 11, successRate: 87, tier: "Silver", tierColor: "from-gray-300 to-gray-500" },
  { id: 8, rank: 8, category: 'Content Creators' as TalentCategory, name: "Maria Garcia", username: "@mariag", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", totalEarnings: 6200, projectsCompleted: 10, successRate: 83, tier: "Bronze", tierColor: "from-amber-600 to-amber-800" },
  { id: 9, rank: 9, category: 'Others' as TalentCategory, name: "Tom Brown", username: "@tomb", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face", totalEarnings: 5800, projectsCompleted: 9, successRate: 89, tier: "Bronze", tierColor: "from-amber-600 to-amber-800" },
  { id: 10, rank: 10, category: 'Developers' as TalentCategory, name: "Anna Lee", username: "@annal", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face", totalEarnings: 5400, projectsCompleted: 8, successRate: 86, tier: "Bronze", tierColor: "from-amber-600 to-amber-800" }
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
  daysUntilReset: 30,
  previousSeasonWinner: "Sarah Kim",
  previousSeasonEarnings: 18950,
  competitionActive: true,
  resetFrequency: "Quarterly"
};

const TalentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('earnings');
  const [filterTier, setFilterTier] = useState('All');
  const [activeCategory, setActiveCategory] = useState<TalentCategory>('Referral Program');
  const [timeRange, setTimeRange] = useState('Seasonal');
  const [filterBy, setFilterBy] = useState('all');
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { profile, user } = useUser();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // Fetch all profiles when Referral Program tab is active
  useEffect(() => {
    const fetchAllProfiles = async () => {
      if (activeCategory === 'Referral Program') {
        setProfilesLoading(true);
        try {
          // Try to fetch with points ordering first
          let { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('points', { ascending: false })
            .order('created_at', { ascending: false });

          // If ordering by points fails (column doesn't exist), try without it
          if (error && (error.message?.includes('column') || error.code === '42703')) {
            console.warn('Points column not found, fetching without points ordering');
            const result = await supabase
              .from('profiles')
              .select('*')
              .order('created_at', { ascending: false });
            data = result.data;
            error = result.error;
          }

          if (error) {
            console.error('Error fetching profiles:', error);
            console.error('Error details:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            // Set empty array on error so UI shows empty state
            setAllProfiles([]);
          } else {
            console.log('Fetched profiles:', data?.length || 0);
            // Ensure points default to 0 if not present
            const profilesWithPoints = (data || []).map(profile => ({
              ...profile,
              points: (profile as any).points ?? 0
            }));
            setAllProfiles(profilesWithPoints);
          }
        } catch (err) {
          console.error('Exception fetching profiles:', err);
          setAllProfiles([]);
        } finally {
          setProfilesLoading(false);
        }
      }
    };

    fetchAllProfiles();
  }, [activeCategory]);

  // Auto-scroll carousel
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [api]);

  const tiers = ['All', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'];

  const filteredTalent = mockTalentData.filter(talent => {
    const matchesSearch = talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talent.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'All' || talent.tier === filterTier;
    const matchesCategory = talent.category === activeCategory;
    return matchesSearch && matchesTier && matchesCategory;
  });

  // Filter profiles for referral program
  const filteredProfiles = allProfiles.filter(profile => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (profile.username?.toLowerCase().includes(searchLower) || false) ||
      (profile.full_name?.toLowerCase().includes(searchLower) || false);
    return matchesSearch;
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

  // Pagination calculations
  const tableDataForReferral = filteredProfiles.slice(3); // Skip top 3
  const tableDataForOther = sortedTalent.slice(3); // Skip top 3
  
  const currentTableData = activeCategory === 'Referral Program' 
    ? tableDataForReferral 
    : tableDataForOther;
  
  const totalPages = Math.ceil(currentTableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = currentTableData.slice(startIndex, endIndex);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const copyReferralCode = async () => {
    if (profile?.referral_code) {
      try {
        await navigator.clipboard.writeText(profile.referral_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      {/* Hero Section - Left-aligned info with right-aligned actions */}
      <section className="relative w-full py-6 md:py-8 bg-gradient-to-br from-[#3366FF]/5 to-[#ECF3FF]/5" style={{
        backgroundImage: 'url(/trophy_gg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Overlay to maintain coloring and dim background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#3366FF]/5 to-[#ECF3FF]/5 backdrop-blur-md"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          {/* Countdown timer - Top right */}
          <div className="flex justify-end mb-4">
            <div className="inline-flex flex-wrap items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3366FF]" />
              <span className="text-xs md:text-sm text-muted-foreground">Leaderboard resets in:</span>
              <span className="text-xs md:text-sm font-bold text-[#3366FF] bg-background/80 backdrop-blur-sm rounded-lg border border-border px-2 md:px-3 py-1 md:py-1.5">{seasonStats.daysUntilReset} days</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Carousel with leaderboard and referral campaign */}
            <div className="flex-1 w-full">
              <Carousel
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {/* Slide 1: Season Leaderboard */}
                  <CarouselItem>
                    <div className="flex items-center gap-4 md:gap-6">
                      {/* Circular avatar/logo */}
                      <div className="relative">
                        <div className="w-18 h-18 md:w-20 md:h-20 bg-gradient-to-br from-[#3366FF] to-[#101B44] rounded-lg flex items-center justify-center shadow-lg">
                          <img src="trophy.png" alt="Blockchain Logo" className="w-12 h-12" />
                        </div>
                      </div>
                      
                      {/* Title and description */}
                      <div>
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2">
                          Season Leaderboard
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground max-w-md">
                          The Blockchain ecosystem talent competition. Find top contributors and compete for rewards.
                        </p>
                      </div>
                    </div>
                  </CarouselItem>

                  {/* Slide 2: Referral Campaign */}
                  <CarouselItem>
                    <div className="flex items-center gap-4 md:gap-6">
                      {/* Circular avatar/logo */}
                      <div className="relative">
                        <div className="w-18 h-18 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                        <img src="trophy.png" alt="Blockchain Logo" className="w-12 h-12" />

                        </div>
                      </div>
                      
                      {/* Title and description */}
                      <div>
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2">
                          Refer to Earn Points
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground max-w-md">
                          Grow in the community and hopefully become an ambassador. Refer friends to earn points.
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                
              </Carousel>
            </div>

            {/* Right-aligned action buttons */}
            <div className="flex sm:flex-row gap-3">
              <Button variant="outline" className="border-[#3366FF] text-[#3366FF] hover:bg-[#3366FF] hover:text-white">
                <Bookmark className="w-4 h-4 " />
              </Button>
              <Button 
                onClick={() => setShowReferralModal(true)}
                className="bg-gradient-to-r from-[#3366FF] to-[#2952CC] hover:from-[#2952CC] hover:to-[#1F3FA3] text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Invite Talent
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Code Modal */}
      <Dialog open={showReferralModal} onOpenChange={setShowReferralModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Talent</DialogTitle>
            <DialogDescription>
              Share your referral code to earn points when others join!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {profile?.referral_code ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-4 bg-muted rounded-lg border-2 border-dashed border-[#3366FF]">
                    <div className="text-sm text-muted-foreground mb-1">Your Referral Code</div>
                    <div className="text-2xl font-bold text-foreground font-mono">
                      {profile.referral_code}
                    </div>
                  </div>
                  <Button
                    onClick={copyReferralCode}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-[#3366FF]" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Share this code with others:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>You earn <strong className="text-[#3366FF]">10 points</strong> for each successful referral</li>
                    <li>They must use your code when signing up</li>
                    <li>Your points are updated automatically</li>
                  </ul>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Your Current Points:</span>
                    <span className="font-bold text-[#3366FF]">{profile.points || 0} pts</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-muted-foreground">
                  {user ? 'Loading your referral code...' : 'Please sign in to get your referral code'}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter/Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8">
          {/* Category Tabs - Left side */}
          <div className="w-full md:w-auto overflow-x-auto">
            <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as TalentCategory)}>
              <TabsList className="bg-muted">
                <TabsTrigger value="Referral Program" className="whitespace-nowrap">Referral Program</TabsTrigger>
                <TabsTrigger value="Content Creators" className="whitespace-nowrap"> Creators</TabsTrigger>
                <TabsTrigger value="Developers" className="whitespace-nowrap">Developers</TabsTrigger>
                <TabsTrigger value="Others" className="whitespace-nowrap">Others</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Right side filters - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            {/* Time Range Filters */}
            <Tabs value={timeRange} onValueChange={setTimeRange}>
              <TabsList className="bg-muted">
                <TabsTrigger value="24h">24h</TabsTrigger>
                <TabsTrigger value="7D">7D</TabsTrigger>
                <TabsTrigger value="30D">30D</TabsTrigger>
                <TabsTrigger value="Seasonal">Seasonal</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Filter Select */}
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[140px] border-[#3366FF] text-[#3366FF]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Players</SelectItem>
                <SelectItem value="my-place">My Place</SelectItem>
                <SelectItem value="top-10">Top 10</SelectItem>
                <SelectItem value="top-50">Top 50</SelectItem>
                <SelectItem value="recent">Recent Activity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        {/* Referral Program Content */}
        {activeCategory === 'Referral Program' ? (
          <>
            {/* Top 3 Players Section (Podium Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
              {profilesLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Skeleton className="w-16 h-16 rounded-full mb-4" />
                      <Skeleton className="h-6 w-24 mb-2" />
                      <Skeleton className="h-4 w-16 mb-4" />
                      <Skeleton className="w-12 h-12 mb-4" />
                      <div className="space-y-2 w-full">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  </Card>
                ))
              ) : filteredProfiles.length === 0 ? (
                <div className="col-span-3 text-center py-8 text-muted-foreground">
                  No users found.
                </div>
              ) : (
                filteredProfiles.slice(0, 3).map((profile, index) => {
                  const trophyColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];
                  return (
                    <Card key={profile.id} className={`p-3 ${index === 0 ? 'ring-2 ring-yellow-500/50' : ''}`}>
                      <div className="flex flex-col">
                        {/* Top Row: Avatar/Name on left, Trophy on right */}
                        <div className="flex items-center justify-between w-full mb-4">
                          {/* Left side: Avatar and Name */}
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={profile.avatar_url || undefined} />
                                <AvatarFallback className="bg-gradient-to-br from-[#3366FF] to-[#101B44] text-white text-sm">
                                  {profile.full_name?.split(' ').map(n => n[0]).join('') || 
                                   profile.username?.charAt(0).toUpperCase() || 
                                   'U'}
                                </AvatarFallback>
                              </Avatar>
                              {index === 0 && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                                  <Crown className="w-2 h-2 text-white" />
                                </div>
                              )}
                            </div>
                            <h3 className="text-sm font-bold text-foreground">
                              {profile.full_name || profile.username || 'No name'}
                            </h3>
                          </div>
                          
                          {/* Right side: Trophy */}
                          <div className={`${trophyColors[index]}`}>
                            {index === 0 && <img src="/trophy.png" alt="Trophy" className="w-12 h-12" />}
                            {index === 1 && <img src="/ice-hockey.png" alt="Ice Hockey" className="w-12 h-12" />}
                            {index === 2 && <img src="/water-polo.png" alt="Water Polo" className="w-12 h-12" />}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="space-y-1 w-full">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Username</span>
                            <span className="text-xs font-semibold text-[#3366FF]">@{profile.username || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Points</span>
                            <span className="text-xs font-semibold text-[#3366FF]">{profile.points || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Joined</span>
                            <span className="text-xs font-semibold text-[#3366FF]">
                              {profile.created_at 
                                ? new Date(profile.created_at).toLocaleDateString()
                                : '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>

            {/* General Leaderboard Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Place</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Player Name</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Username</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Points</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profilesLoading ? (
                      Array.from({ length: 7 }).map((_, i) => (
                        <tr key={i} className="border-t border-border">
                          <td className="px-2 sm:px-4 py-2 sm:py-3"><Skeleton className="h-4 w-8" /></td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
                              <Skeleton className="h-4 w-20 sm:w-24" />
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3"><Skeleton className="h-4 w-12 sm:w-16" /></td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3"><Skeleton className="h-4 w-10 sm:w-12" /></td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3"><Skeleton className="h-4 w-12 sm:w-16" /></td>
                        </tr>
                      ))
                    ) : filteredProfiles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                          No users found.
                        </td>
                      </tr>
                    ) : currentTableData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                          All users are displayed above.
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((item, index) => {
                        const actualIndex = startIndex + index;
                        const rank = actualIndex + 4; // +4 because top 3 are shown in cards
                        // Type guard to check if it's a Profile
                        const isProfile = 'avatar_url' in item || 'points' in item;
                        const profile = isProfile ? item as Profile : null;
                        
                        if (!profile) return null;
                        
                        return (
                        <tr key={profile.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            <div className="flex items-center gap-2">
                              {getRankIcon(rank)}
                              <span className="font-bold text-xs sm:text-sm">{rank}</span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                                <AvatarImage src={profile.avatar_url || undefined} />
                                <AvatarFallback className="bg-gradient-to-br from-[#3366FF] to-[#101B44] text-white text-xs">
                                  {profile.full_name?.split(' ').map((n: string) => n[0]).join('') || 
                                   profile.username?.charAt(0).toUpperCase() || 
                                   'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold text-xs sm:text-sm text-foreground">
                                  {profile.full_name || 'No name'}
                                </div>
                                {profile.bio && (
                                  <div className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">
                                    {profile.bio}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              @{profile.username || 'no-username'}
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            <div className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#3366FF] to-[#2952CC] text-white">
                              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              {profile.points || 0} pts
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {profile.created_at 
                                ? new Date(profile.created_at).toLocaleDateString()
                                : '-'}
                            </div>
                          </td>
                        </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              {currentTableData.length > 0 && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border">
                  <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                    Showing {startIndex + 1} to {Math.min(endIndex, currentTableData.length)} of {currentTableData.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0 border-[#3366FF] text-[#3366FF] hover:bg-[#3366FF] hover:text-white disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 p-0 text-xs sm:text-sm ${
                            currentPage === page
                              ? "bg-gradient-to-r from-[#3366FF] to-[#2952CC] text-white hover:from-[#2952CC] hover:to-[#1F3FA3]"
                              : "border-[#3366FF] text-[#3366FF] hover:bg-[#3366FF] hover:text-white"
                          }`}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0 border-[#3366FF] text-[#3366FF] hover:bg-[#3366FF] hover:text-white disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </>
        ) : (
          <>
            {/* Top 3 Players Section (Podium Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
  {loading ? (
    Array.from({ length: 3 }).map((_, i) => (
      <Card key={i} className="p-6">
        <div className="flex flex-col items-center text-center">
          <Skeleton className="w-16 h-16 rounded-full mb-4" />
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-4 w-16 mb-4" />
          <Skeleton className="w-12 h-12 mb-4" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </div>
              </div>
            </Card>
    ))
  ) : (
    sortedTalent.slice(0, 3).map((talent, index) => {
      const trophyColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];
      return (
        <Card key={talent.id} className={`p-3 ${index === 0 ? 'ring-2 ring-yellow-500/50' : ''}`}>
          <div className="flex flex-col">
            {/* Top Row: Avatar/Name on left, Trophy on right */}
            <div className="flex items-center justify-between w-full mb-4">
              {/* Left side: Avatar and Name */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={talent.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-[#3366FF] to-[#101B44] text-white text-sm">
                      {talent.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Crown className="w-2 h-2 text-white" />
                </div>
                  )}
                </div>
                <h3 className="text-sm font-bold text-foreground">Upcoming</h3>
              </div>
              
              {/* Right side: Trophy */}
              <div className={`${trophyColors[index]}`}>
                {index === 0 && <img src="/trophy.png" alt="Trophy" className="w-12 h-12" />}
                {index === 1 && <img src="/ice-hockey.png" alt="Ice Hockey" className="w-12 h-12" />}
                {index === 2 && <img src="/water-polo.png" alt="Water Polo" className="w-12 h-12" />}
                    </div>
            </div>

            {/* Stats */}
            <div className="space-y-1 w-full">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Earnings</span>
                <span className="text-xs font-semibold text-[#3366FF]">-</span>
                </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Projects</span>
                <span className="text-xs font-semibold">-</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Success</span>
                <span className="text-xs font-semibold text-[#3366FF]">-</span>
              </div>
            </div>
          </div>
        </Card>
      );
    })
  )}
</div>

        

        {/* General Leaderboard Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Place</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Player Name</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Earnings</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Projects</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Success Rate</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Tier</th>
                </tr>
              </thead>
              <tbody>
              {loading ? (
                  Array.from({ length: 7 }).map((_, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-2 sm:px-4 py-2 sm:py-3"><Skeleton className="h-4 w-8" /></td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
                          <Skeleton className="h-4 w-20 sm:w-24" />
                      </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3"><Skeleton className="h-4 w-12 sm:w-16" /></td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3"><Skeleton className="h-4 w-10 sm:w-12" /></td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3"><Skeleton className="h-4 w-10 sm:w-12" /></td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3"><Skeleton className="h-4 w-12 sm:w-16" /></td>
                    </tr>
                ))
              ) : currentTableData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      All players are displayed above.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => {
                    const actualIndex = startIndex + index;
                    const rank = actualIndex + 4; // +4 because top 3 are shown in cards
                    // Type guard to check if it's a talent (not Profile)
                    const isTalent = 'avatar' in item || 'tier' in item;
                    const talent = isTalent ? item as typeof mockTalentData[0] : null;
                    
                    if (!talent) return null;
                    
                    return (
                    <tr key={talent.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="flex items-center gap-2">
                        {getRankIcon(rank)}
                          <span className="font-bold text-xs sm:text-sm">{rank}</span>
                      </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                          <AvatarImage src={talent.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-[#3366FF] to-[#101B44] text-white text-xs">
                            {talent.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                          <div>
                            <div className="font-semibold text-xs sm:text-sm text-foreground">Upcoming</div>
                            <div className="text-xs sm:text-sm text-muted-foreground hidden sm:block">-</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="font-bold text-xs sm:text-sm text-[#3366FF]">-</div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="font-semibold text-xs sm:text-sm">-</div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="font-semibold text-xs sm:text-sm text-[#3366FF]">-</div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-gradient-to-r ${talent.tierColor} text-white`}>
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          {talent.tier}
                        </div>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {currentTableData.length > 0 && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border">
              <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                Showing {startIndex + 1} to {Math.min(endIndex, currentTableData.length)} of {currentTableData.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 border-[#3366FF] text-[#3366FF] hover:bg-[#3366FF] hover:text-white disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`h-8 w-8 p-0 text-xs sm:text-sm ${
                        currentPage === page
                          ? "bg-gradient-to-r from-[#3366FF] to-[#2952CC] text-white hover:from-[#2952CC] hover:to-[#1F3FA3]"
                          : "border-[#3366FF] text-[#3366FF] hover:bg-[#3366FF] hover:text-white"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 border-[#3366FF] text-[#3366FF] hover:bg-[#3366FF] hover:text-white disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Call to Action - Mobile Responsive */}
        <div className="mt-4 md:mt-6 text-center" >
          <Card className="p-3 md:p-4 bg-gradient-to-r from-[#3366FF]/10 to-[#ECF3FF]/10 border-[#3366FF]/20">
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3" >Ready to Join the Competition?</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 max-w-2xl mx-auto" >
              Start contributing to the Blockchain ecosystem and compete for the top spot in Season {seasonStats.seasonNumber}.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center" >
              <Button className="bg-gradient-to-r from-[#3366FF] to-[#2952CC] hover:from-[#2952CC] hover:to-[#1F3FA3] text-white px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm">
                Browse Opportunities
              </Button>
              <Button variant="outline" className="px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm">
                Create Profile
              </Button>
            </div>
            <div className="mt-2 md:mt-3 text-xs text-muted-foreground" >
              Next reset: {new Date(seasonStats.nextReset).toLocaleDateString()} ({seasonStats.daysUntilReset} days)
            </div>
          </Card>
        </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TalentPage;
