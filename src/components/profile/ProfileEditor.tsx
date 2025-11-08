import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { UserCog, Edit3, X, Save, Upload, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";

const ProfileEditor = ({ 
  profile, 
  editedProfile, 
  setEditedProfile, 
  isEditing, 
  setIsEditing, 
  handleSave,
  onImageSelect,
  isUploading 
}: {
  profile: any;
  editedProfile: any;
  setEditedProfile: (profile: any) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  handleSave: () => Promise<void>;
  onImageSelect?: (file: File) => void;
  isUploading?: boolean;
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Clear preview when exiting edit mode
  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
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

  // Check if profile is incomplete
  const isProfileIncomplete = !profile.full_name || !profile.username || !profile.bio || !profile.avatar_url;

  return (
    <>
      {isProfileIncomplete && (
        <div className="bg-green-200 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-4 mb-6">
          <p className="text-green-800 dark:text-green-200 text-sm font-medium">
            ⚠️ Please complete your profile to use the platform. Add your full name, username, bio, and profile image.
          </p>
        </div>
      )}
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
          {/* Profile Image Section */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Profile Image
            </label>
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-2 border-border">
                <AvatarImage 
                  src={imagePreview || editedProfile?.avatar_url || profile?.avatar_url || ""} 
                  alt="Profile"
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback className="bg-green-600 text-white text-lg">
                  {(profile?.username || profile?.full_name || "U").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Validate file type
                        if (!file.type.startsWith('image/')) {
                          alert('Please select an image file');
                          return;
                        }
                        // Validate file size (5MB max)
                        if (file.size > 5 * 1024 * 1024) {
                          alert('Image size must be less than 5MB');
                          return;
                        }
                        // Create preview
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                        // Notify parent component
                        if (onImageSelect) {
                          onImageSelect(file);
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </Button>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImagePreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </Button>
                  )}
                </div>
              )}
              {!isEditing && !profile?.avatar_url && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <ImageIcon className="w-4 h-4" />
                  <span>No profile image</span>
                </div>
              )}
            </div>
          </div>

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
            <p className="text-xs text-muted-foreground mb-3">
              {isEditing && (
                <>
                  <span className="font-semibold">Talent</span> can only apply for bounties. <span className="font-semibold">SPE</span> can post and manage bounties. <span className="font-semibold">Admin</span> conducts and oversees all platform affairs.
                </>
              )}
            </p>
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
                <button disabled
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Referral Code
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              Enter a referral code to earn points. This can only be done once.
            </p>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.entered_referral_code || ""}
                onChange={(e) => {
                  setEditedProfile({ 
                    ...editedProfile, 
                    entered_referral_code: e.target.value.toUpperCase().trim() 
                  });
                }}
                disabled={editedProfile.was_referred || profile.was_referred || false}
                maxLength={5}
                className={`w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-mono uppercase ${
                  (editedProfile.was_referred || profile.was_referred)
                    ? 'opacity-50 cursor-not-allowed bg-muted' 
                    : ''
                }`}
                placeholder="Enter 5-character code"
              />
            ) : (
              <div className="flex items-center gap-2">
                {(editedProfile.was_referred || profile.was_referred) ? (
                  <p className="text-foreground font-mono text-sm">
                    {editedProfile.used_referral_code || profile.used_referral_code || "Already used"}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Not entered yet
                  </p>
                )}
                {(editedProfile.was_referred || profile.was_referred) && (
                  <span className="text-xs text-green-500">✓ Used</span>
                )}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSave} 
                className="bg-green-600 hover:bg-green-700"
                disabled={isUploading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isUploading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-border text-foreground hover:bg-muted"
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </>
  );
};

export default ProfileEditor;


