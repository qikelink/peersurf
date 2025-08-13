import { useUser } from "../../contexts/UserContext";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { updateUserProfile, createUserProfile } from "../../lib/auth";
import Navbar from "../nav-bar";
import { Settings, LogOut, User, Mail, Wallet, Bell } from "lucide-react";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading, profile, refreshProfile, currency, setCurrency, signOut } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(profile || {});

  if (userLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto px-8 py-8">
        <button
          onClick={() => navigate("/wallet")}
          className="text-gray-400 hover:text-white transition mb-6"
        >
          ← Back to Wallet
        </button>
        <h1 className="text-3xl font-semibold mb-2">Profile</h1>
        <p className="text-gray-400">
          Manage your PeerSurf account and preferences
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border border-gray-700 p-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="bg-green-600 text-white">
                    {profile.username?.slice(0, 2)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">
                    {profile.full_name || profile.username || "User"}
                  </h2>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <p className="text-white">
                    {profile.full_name || (user as any)?.user_metadata?.full_name || (user as any)?.user_metadata?.name || profile.username || user.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <p className="text-white">{profile.username || "Not set"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Role
                  </label>
                  {isEditing ? (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setEditedProfile({ ...editedProfile, role: "talent" })}
                        className={`px-3 py-2 rounded-lg border text-sm ${editedProfile.role === "talent" ? "border-green-500 bg-green-500/10 text-green-300" : "border-gray-600 bg-gray-800 text-gray-300"}`}
                      >
                        Talent
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditedProfile({ ...editedProfile, role: "sponsor" })}
                        className={`px-3 py-2 rounded-lg border text-sm ${editedProfile.role === "sponsor" ? "border-green-500 bg-green-500/10 text-green-300" : "border-gray-600 bg-gray-800 text-gray-300"}`}
                      >
                        Sponsor
                      </button>
                    </div>
                  ) : (
                    <p className="text-white capitalize">{profile.role || "Not set"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Wallet Address
                  </label>
                  <p className="text-white font-mono text-sm">
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
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
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
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Currency Settings */}
            <Card className="bg-gray-900 border border-gray-700 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Preferences
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="NGN">NGN</option>
                </select>
              </div>
            </Card>

            {/* Account Actions */}
            <Card className="bg-gray-900 border border-gray-700 p-6">
              <h3 className="font-semibold mb-4">Account</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => navigate("/notifications")}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800"
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
          </div>
      </div>
      </div>
      </div>
    </>
  );
};

export default ProfilePage;
