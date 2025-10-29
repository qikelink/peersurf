import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { UserCog, Edit3, X, Save } from "lucide-react";

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
  // Don't render if profile is not loaded yet
  if (!profile) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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

export default ProfileEditor;


