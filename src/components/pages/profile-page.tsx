import { useUser } from "../../contexts/UserContext";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { updateUserProfile, createUserProfile } from "../../lib/auth";
import Navbar from "../nav-bar";
import { Settings, LogOut, Wallet, Bell, Share2, Pencil, Github, Globe, X as XIcon, DollarSign, Trophy, FileText, LinkedinIcon } from "lucide-react";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading, profile, refreshProfile, currency, setCurrency, signOut } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(profile || {});

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading profile...</p>
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
    await updateUserProfile(user.id, {
      // Only role is editable
      role: editedProfile.role || null,
    });
    await refreshProfile();
    setIsEditing(false);
  };

  // Derived view data with sensible fallbacks
  const locationText: string = (profile?.location || (profile?.country && `Based in ${profile.country}`)) || "Based in Nigeria";
  const stats = {
    earned: profile?.earned ?? 0,
    submissions: profile?.submissions ?? 0,
    won: profile?.won ?? 0,
  };
  // Expect optional JSON-like skills on profile; otherwise defaults
  const defaultSkills: Record<string, string[]> = {
    FRONTEND: ["React", "TypeScript", "Tailwind"],
    BLOCKCHAIN: ["Solidity", "Move", "Rust"],
    BACKEND: ["Node.js", "TypeScript", "PostgreSQL"],
    MOBILE: ["React Native", "Android"],
    DESIGN: ["UI/UX Design", "Figma"],
    GROWTH: ["Digital Marketing"],
    CONTENT: ["Social Media", "Technical Writing"],
  };
  const profileSkills: Record<string, string[]> = (() => {
    const s = (profile as any)?.skills;
    if (!s) return defaultSkills;
    try {
      // support JSON string or object
      const parsed = typeof s === "string" ? JSON.parse(s) : s;
      return { ...defaultSkills, ...parsed };
    } catch {
      return defaultSkills;
    }
  })();
  const proofOfWork: Array<{ title: string; url?: string; description?: string }> =
    (profile as any)?.proof_of_work || [];
  const activityFeed: Array<{ title: string; ts?: string; icon?: string }> =
    (profile as any)?.activity || [];
  const personalProjects: Array<{ name: string; url?: string; description?: string }> =
    (profile as any)?.projects || [];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-foreground">
      {/* Header */}

      <div className="w-full max-w-7xl mx-auto px-8 py-8">
       </div>

      <div className="w-full max-w-7xl mx-auto px-8 pb-20 -mt-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="bg-card border border-border p-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="bg-green-600 text-white">
                    {profile.username?.slice(0, 2)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold truncate">
                    {profile.full_name || profile.username || "User"}
                  </h2>
                  <p className="text-sm text-muted-foreground truncate">@{profile.username || (user.email?.split("@")[0])}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="border-border text-foreground hover:bg-muted" onClick={() => setIsEditing(true)}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit Profile
                  </Button>
                  <Button variant="outline" className="border-border text-foreground hover:bg-muted" onClick={() => {
                    const shareUrl = window.location.href;
                    if ((navigator as any).share) {
                      (navigator as any).share({ title: "PeerSurf Profile", url: shareUrl }).catch(() => {});
                    } else {
                      navigator.clipboard?.writeText(shareUrl);
                    }
                  }}>
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <p className="text-foreground">
                    {profile.full_name || (user as any)?.user_metadata?.full_name || (user as any)?.user_metadata?.name || profile.username || user.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Username
                  </label>
                  <p className="text-foreground">{profile.username || "Not set"}</p>
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
                        onClick={() => setEditedProfile({ ...editedProfile, role: "sponsor" })}
                        className={`px-3 py-2 rounded-lg border text-sm ${editedProfile.role === "sponsor" ? "border-green-500 bg-green-500/10 text-green-300" : "border-border bg-muted text-foreground"}`}
                      >
                        Sponsor
                      </button>
                    </div>
                  ) : (
                    <p className="text-white capitalize">{profile.role || "Not set"}</p>
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

                <div className="flex gap-3 pt-4">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="border-border text-foreground hover:bg-muted"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Details & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="bg-card border border-border p-5 md:col-span-2">
                <h3 className="font-semibold mb-3">Details</h3>
                <div className="text-sm text-muted-foreground">{locationText}</div>
              </Card>
              <Card className="bg-card border border-border p-5">
                <h3 className="font-semibold mb-3">Stats</h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="flex flex-col items-center">
                    <DollarSign className="text-green-500 mb-1" />
                    <div className="text-foreground font-semibold">${stats.earned}</div>
                    <div className="text-xs text-muted-foreground">Earned</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <FileText className="text-blue-400 mb-1" />
                    <div className="text-foreground font-semibold">{stats.submissions}</div>
                    <div className="text-xs text-muted-foreground">Submissions</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Trophy className="text-yellow-400 mb-1" />
                    <div className="text-foreground font-semibold">{stats.won}</div>
                    <div className="text-xs text-muted-foreground">Won</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Skills */}
            <Card className="bg-card border border-border p-6 mt-6">
              <h3 className="font-semibold mb-4">Skills</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.entries(profileSkills).map(([group, list]) => (
                  <div key={group}>
                    <div className="text-xs font-semibold text-muted-foreground mb-2">{group}</div>
                    <div className="flex flex-wrap gap-2">
                      {list.map((skill) => (
                        <Badge key={`${group}-${skill}`} className="bg-muted text-foreground border border-border">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Currency Settings */}
            <Card className="bg-card border border-border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Preferences
              </h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="NGN">NGN</option>
                </select>
              </div>
            </Card>

            {/* Account Actions */}
            <Card className="bg-card border border-border p-6">
              <h3 className="font-semibold mb-4">Account</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-border text-foreground hover:bg-muted"
                  onClick={() => navigate("/notifications")}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-border text-foreground hover:bg-muted"
                  onClick={() => navigate("/cards")}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Cards
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-red-600 text-red-400 hover:bg-red-900"
                  onClick={async () => { await signOut(); navigate("/auth?mode=login"); }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </Card>

            {/* Social links placeholder */}
            <Card className="bg-card border border-border p-6">
              <h3 className="font-semibold mb-4">Links</h3>
              <div className="flex items-center gap-3 text-muted-foreground">
                <button className="p-2 rounded-md hover:bg-muted" title="Website"><Globe  /></button>
                <button className="p-2 rounded-md hover:bg-muted" title="GitHub"><Github  /></button>
                <button className="p-2 rounded-md hover:bg-muted" title="X"><XIcon  /></button>
                <button className="p-2 rounded-md hover:bg-muted" title="X"><LinkedinIcon /></button>
              </div>
            </Card>
            {/* Proof of Work */}
            <Card className="bg-card border border-border p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Proof of Work</h3>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">Add</Button>
              </div>
              {proofOfWork.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  talent empty — Add some proof of work to build your profile
                </div>
              ) : (
                <div className="space-y-3">
                  {proofOfWork.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-border bg-popover/20">
                      <div className="font-medium text-foreground">{p.title}</div>
                      {p.description && (
                        <div className="text-sm text-muted-foreground">{p.description}</div>
                      )}
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">View</a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Personal Projects */}
            <Card className="bg-card border border-border p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Personal Projects</h3>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">Add</Button>
              </div>
              {personalProjects.length === 0 ? (
                <div className="text-sm text-muted-foreground">No projects yet.</div>
              ) : (
                <div className="space-y-3">
                  {personalProjects.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-border bg-popover/20">
                      <div className="font-medium text-foreground">{p.name}</div>
                      {p.description && (
                        <div className="text-sm text-muted-foreground">{p.description}</div>
                      )}
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">View</a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
      </div>
      </div>
      </div>
    </>
  );
};

export default ProfilePage;
