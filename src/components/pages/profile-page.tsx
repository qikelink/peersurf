import { useUser } from "../../contexts/UserContext";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { updateUserProfile, createUserProfile } from "../../lib/auth";
import { supabase } from "../../lib/supabase";
import Navbar from "../nav-bar";
import { 
  Settings, LogOut, Wallet, Bell, Share2, Pencil, Github, Globe, X as XIcon, 
  DollarSign, Trophy, FileText, LinkedinIcon, LayoutDashboard, Target, 
  Users, BarChart3, Shield, Crown, Briefcase, GitBranch, Calendar, 
  TrendingUp, UserCheck, UserX, Activity, Database, UserCog, Edit3, Save, X
} from "lucide-react";
import { useEffect, useState } from "react";

// Types
interface NavigationItem {
  id: string;
  label: string;
  icon: any;
}

interface DashboardData {
  assignedProjects: Array<{
    id: string;
    name: string;
    status: string;
    progress: number;
    created_at: string;
  }>;
  contributions: {
    weekly: number;
    monthly: number;
    allTime: number;
  };
  paymentHistory: {
    totalPayouts: number;
    completedBounties: Array<{
      id: string;
      name: string;
      amount: number;
      completed_at: string;
    }>;
  };
  activeBounties: Array<{
    id: string;
    title: string;
    budget: number;
    applicants: number;
    created_at: string;
  }>;
  pendingRoleRequests: Array<{
    id: string;
    user_id: string;
    username: string;
    requested_role: string;
    created_at: string;
  }>;
}

interface UserStats {
  total_earned: number;
  total_submissions: number;
  total_won: number;
}

// Sidebar Component
const Sidebar = ({ 
  profile, 
  activeSection, 
  setActiveSection, 
  requestedRole, 
  handleRoleRequest, 
  navigate, 
  signOut 
}: {
  profile: any;
  activeSection: string;
  setActiveSection: (section: string) => void;
  requestedRole: string | null;
  handleRoleRequest: (role: string) => void;
  navigate: any;
  signOut: () => Promise<void>;
}) => {
  const getNavigationItems = () => {
    const baseItems: NavigationItem[] = [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "bounties", label: "Bounties", icon: Target },
      { id: "grants", label: "Grants", icon: Briefcase },
      { id: "talent-hub", label: "Talent Hub", icon: Users },
    ];

    const speItems: NavigationItem[] = [
      { id: "bounty-management", label: "Bounty Management", icon: Target },
      { id: "team-management", label: "Team Management", icon: Users },
    ];

    const adminItems: NavigationItem[] = [
      { id: "user-management", label: "User Management", icon: UserCog },
      { id: "ecosystem-analytics", label: "Ecosystem Analytics", icon: BarChart3 },
    ];

    return { baseItems, speItems, adminItems };
  };

  return (
    <div className="w-64 bg-card border-r border-border min-h-screen p-4">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="bg-green-600 text-white">
              {profile.username?.slice(0, 2)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-sm">{profile.full_name || profile.username}</div>
            <Badge variant="secondary" className="text-xs capitalize">{profile.role || "Talent"}</Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {getNavigationItems().baseItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              activeSection === item.id
                ? "bg-green-600 text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}

        {/* SPE Management Section */}
        {(profile.role === "SPE" || profile.role === "admin") && (
          <>
            <div className="pt-4 pb-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                SPE Management
              </div>
            </div>
            {getNavigationItems().speItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === item.id
                    ? "bg-green-600 text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </>
        )}

        {/* Admin Tools Section */}
        {profile.role === "admin" && (
          <>
            <div className="pt-4 pb-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                Admin Tools
              </div>
            </div>
            {getNavigationItems().adminItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === item.id
                    ? "bg-green-600 text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </>
        )}
      </nav>

              {/* Role Request Section */}
        {profile.role === "talent" && (
        <div className="mt-8 p-4 border border-border rounded-lg">
          <h4 className="font-semibold text-sm mb-3">Request Role Upgrade</h4>
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleRoleRequest("SPE")}
            >
              <Shield className="w-4 h-4 mr-2" />
              Request SPE Role
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleRoleRequest("admin")}
            >
              <Crown className="w-4 h-4 mr-2" />
              Request Admin Role
            </Button>
          </div>
                          {requestedRole && (
                  <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-400">
                    Your role has been updated to {requestedRole} successfully!
                  </div>
                )}
        </div>
      )}

      {/* Account Actions */}
      <div className="mt-8 space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => navigate("/notifications")}
        >
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-red-400 border-red-500 hover:bg-red-50"
          onClick={async () => { await signOut(); navigate("/auth?mode=login"); }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

// Profile Editor Component
const ProfileEditor = ({ 
  profile, 
  editedProfile, 
  setEditedProfile, 
  isEditing, 
  setIsEditing, 
  handleSave 
}: {
  profile: any;
  editedProfile: any;
  setEditedProfile: (profile: any) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  handleSave: () => Promise<void>;
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <UserCog className="w-5 h-5" />
            Profile Information
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.full_name || ""}
                onChange={(e) => {
                  console.log('Updating full_name:', e.target.value);
                  setEditedProfile({ ...editedProfile, full_name: e.target.value });
                }}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-foreground">
                {profile.full_name || "Not set"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Username
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.username || ""}
                onChange={(e) => {
                  console.log('Updating username:', e.target.value);
                  setEditedProfile({ ...editedProfile, username: e.target.value });
                }}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="Enter your username"
              />
            ) : (
              <p className="text-foreground">{profile.username || "Not set"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={editedProfile.bio || ""}
                onChange={(e) => {
                  console.log('Updating bio:', e.target.value);
                  setEditedProfile({ ...editedProfile, bio: e.target.value });
                }}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground min-h-[100px] resize-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-foreground">
                {profile.bio || "No bio added yet."}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Role
            </label>
            {isEditing ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditedProfile({ ...editedProfile, role: "talent" })}
                  className={`px-3 py-2 rounded-lg border text-sm ${editedProfile.role === "talent" ? "border-green-500 bg-green-500/10 text-green-300" : "border-border bg-muted text-foreground"}`}
                >
                  Talent
                </button>
                <button
                  type="button"
                  onClick={() => setEditedProfile({ ...editedProfile, role: "SPE" })}
                  className={`px-3 py-2 rounded-lg border text-sm ${editedProfile.role === "SPE" ? "border-green-500 bg-green-500/10 text-green-300" : "border-border bg-muted text-foreground"}`}
                >
                  SPE
                </button>
                <button
                  type="button"
                  onClick={() => setEditedProfile({ ...editedProfile, role: "admin" })}
                  className={`px-3 py-2 rounded-lg border text-sm ${editedProfile.role === "admin" ? "border-green-500 bg-green-500/10 text-green-300" : "border-border bg-muted text-foreground"}`}
                >
                  Admin
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {profile.role || "Talent"}
                </Badge>
                {profile.role === "talent" && (
                  <span className="text-xs text-muted-foreground">(Default)</span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Wallet Address
            </label>
            <p className="text-foreground font-mono text-sm">
              {profile.wallet_address || "Not connected"}
            </p>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Dashboard Content Component
const DashboardContent = ({ activeSection, profile, dashboardData, userStats, handleRoleAction }: {
  activeSection: string;
  profile: any;
  dashboardData: DashboardData;
  userStats: UserStats;
  handleRoleAction: (requestId: string, action: 'approve' | 'deny') => Promise<void>;
}) => {
  const renderDashboardContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Profile Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCog className="w-5 h-5" />
                  Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">User Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-muted-foreground">Name:</span> {profile.full_name || profile.username}</div>
                      <div><span className="text-muted-foreground">GitHub:</span> <a href="#" className="text-primary hover:underline">github.com/{profile.username}</a></div>
                      {profile.bio && (
                        <div>
                          <span className="text-muted-foreground">Bio:</span> 
                          <p className="text-foreground mt-1">{profile.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Contributions</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-500">{dashboardData.contributions.weekly}</div>
                        <div className="text-xs text-muted-foreground">Weekly</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-500">{dashboardData.contributions.monthly}</div>
                        <div className="text-xs text-muted-foreground">Monthly</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-500">{dashboardData.contributions.allTime}</div>
                        <div className="text-xs text-muted-foreground">All-time</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
                  Assigned Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.assignedProjects.map((project: any) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">{project.status}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{project.progress}%</div>
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-full h-2 bg-green-500 rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Payouts Received:</span>
                    <span className="text-xl font-bold text-green-500">${dashboardData.paymentHistory.totalPayouts}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Completed Bounties</h4>
                    <div className="space-y-2">
                      {dashboardData.paymentHistory.completedBounties.map((bounty: any) => (
                        <div key={bounty.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <div className="font-medium">{bounty.name || bounty.title}</div>
                            <div className="text-sm text-muted-foreground">{bounty.completed_at || bounty.date}</div>
                          </div>
                          <div className="text-green-500 font-semibold">${bounty.amount}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "bounty-management":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Bounty Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Active Bounties</h3>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Target className="w-4 h-4 mr-2" />
                    List New Bounty
                  </Button>
                </div>
                <div className="space-y-4">
                  {dashboardData.activeBounties.map((bounty: any) => (
                    <div key={bounty.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{bounty.title}</h4>
                        <p className="text-sm text-muted-foreground">{bounty.applicants || 0} applicants</p>
                      </div>
                      <div className="text-right">
                        <div className="text-green-500 font-semibold">${bounty.budget}</div>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "user-management":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCog className="w-5 h-5" />
                  Role Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pending Role Requests</h3>
                  {dashboardData.pendingRoleRequests.map((request: any) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">@{request.username || request.user}</div>
                        <div className="text-sm text-muted-foreground">Requested: {request.requested_role || request.requestedRole}</div>
                        <div className="text-xs text-muted-foreground">{request.created_at || request.date}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleRoleAction(request.id, 'approve')}
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-500 border-red-500 hover:bg-red-50"
                          onClick={() => handleRoleAction(request.id, 'deny')}
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Deny
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p>This section is under development.</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return renderDashboardContent();
};

// Main Profile Page Component
const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading, profile, refreshProfile, currency, setCurrency, signOut } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(profile || {});
  const [activeSection, setActiveSection] = useState("dashboard");
  const [requestedRole, setRequestedRole] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    assignedProjects: [],
    contributions: { weekly: 0, monthly: 0, allTime: 0 },
    paymentHistory: { totalPayouts: 0, completedBounties: [] },
    activeBounties: [],
    pendingRoleRequests: [],
  });
  const [userStats, setUserStats] = useState<UserStats>({
    total_earned: 0,
    total_submissions: 0,
    total_won: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update editedProfile when profile changes
  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  // Fetch dashboard data from Supabase
  const fetchDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Fetch assigned projects
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('assigned_to', user.id)
        .order('created_at', { ascending: false });

      // Fetch contributions (submissions)
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const { data: allSubmissions } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id);

      const weeklySubmissions = allSubmissions?.filter(s => new Date(s.created_at) >= weekAgo).length || 0;
      const monthlySubmissions = allSubmissions?.filter(s => new Date(s.created_at) >= monthAgo).length || 0;

      // Fetch payment history
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      // Fetch active bounties (for SPE/Admin)
      const { data: bounties } = await supabase
        .from('bounties')
        .select('*')
        .eq('created_by', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Fetch pending role requests (for Admin)
      const { data: roleRequests } = await supabase
        .from('role_requests')
        .select(`
          *,
          profiles:user_id(username)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      // Calculate user stats
      const totalEarned = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
      const totalSubmissions = allSubmissions?.length || 0;
      const totalWon = allSubmissions?.filter(s => s.status === 'approved').length || 0;

      setDashboardData({
        assignedProjects: projects || [],
        contributions: {
          weekly: weeklySubmissions,
          monthly: monthlySubmissions,
          allTime: totalSubmissions,
        },
        paymentHistory: {
          totalPayouts: totalEarned,
          completedBounties: payments || [],
        },
        activeBounties: bounties || [],
        pendingRoleRequests: roleRequests || [],
      });

      setUserStats({
        total_earned: totalEarned,
        total_submissions: totalSubmissions,
        total_won: totalWon,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when user changes
  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  // Ensure a profile row exists for logged-in users (first-time login or missing profile)
  useEffect(() => {
    const ensureProfile = async () => {
      if (user && !profile) {
        try {
          await createUserProfile({ id: user.id });
          await refreshProfile();
        } catch (e) {
          // ignore and let refresh try again later
        }
      }
    };
    ensureProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, profile]);

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>{userLoading ? "Loading profile..." : "Loading dashboard data..."}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p>Please log in to view your profile.</p>
          <Button onClick={() => navigate("/auth?mode=login")} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (user && !profile) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Setting up your profile...</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await updateUserProfile(user.id, {
        full_name: editedProfile.full_name,
        username: editedProfile.username,
        bio: editedProfile.bio,
        role: editedProfile.role || 'talent',
      });
      
      if (error) {
        console.error('Error updating profile:', error);
        setError('Failed to save profile. Please try again.');
        return;
      }
      
      console.log('Profile updated successfully:', data);
      await refreshProfile();
      setIsEditing(false);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Please try again.');
    }
  };



  const handleRoleRequest = async (role: string) => {
    if (!user?.id) return;
    
    try {
      setRequestedRole(role);
      
      // For testing: Update the profile immediately
      // In production, this should create a role request instead
      const { data, error } = await updateUserProfile(user.id, {
        role: role as 'talent' | 'SPE' | 'admin',
      });
      
      if (error) {
        console.error('Error updating role:', error);
        setRequestedRole(null);
        setError('Failed to update role. Please try again.');
        return;
      }
      
      console.log('Role updated successfully:', data);
      await refreshProfile();
      
      // Show success message briefly
      setTimeout(() => setRequestedRole(null), 3000);
    } catch (error) {
      console.error('Error requesting role:', error);
      setRequestedRole(null);
      setError('Failed to request role upgrade. Please try again.');
    }
  };

  // Handle role approval/denial (for Admin)
  const handleRoleAction = async (requestId: string, action: 'approve' | 'deny') => {
    try {
      if (action === 'approve') {
        // Get the role request details
        const { data: request } = await supabase
          .from('role_requests')
          .select('*')
          .eq('id', requestId)
          .single();

        if (request) {
          // Update the user's role
          await updateUserProfile(request.user_id, {
            role: request.requested_role as 'talent' | 'SPE' | 'admin',
          });

          // Update the role request status
          await supabase
            .from('role_requests')
            .update({ status: 'approved', updated_at: new Date().toISOString() })
            .eq('id', requestId);
        }
      } else {
        // Deny the request
        await supabase
          .from('role_requests')
          .update({ status: 'denied', updated_at: new Date().toISOString() })
          .eq('id', requestId);
      }

      // Refresh dashboard data
      await fetchDashboardData();
    } catch (error) {
      console.error('Error handling role action:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-foreground max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          {/* Sidebar */}
          <Sidebar
            profile={profile}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            requestedRole={requestedRole}
            handleRoleRequest={handleRoleRequest}
            navigate={navigate}
            signOut={signOut}
          />

          {/* Main Content */}
          <div className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                  <button 
                    onClick={() => {
                      setError(null);
                      fetchDashboardData();
                    }}
                    className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
                  >
                    Try again
                  </button>
                </div>
              )}
              {/* Profile Editor */}
              <ProfileEditor
                profile={profile}
                editedProfile={editedProfile}
                setEditedProfile={setEditedProfile}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                handleSave={handleSave}
              />

              {/* Dashboard Content */}
              <DashboardContent
                activeSection={activeSection}
                profile={profile}
                dashboardData={dashboardData}
                userStats={userStats}
                handleRoleAction={handleRoleAction}
              />
          </div>
      </div>
      </div>
      </div>
    </>
  );
};

export default ProfilePage;
