import { useState } from "react";
import { Button } from "../ui/button";
import { updatePassword } from "../../lib/auth";
import { signIn } from "../../lib/auth";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import { Eye, EyeOff } from "lucide-react";

const PasswordChange = () => {
  const { isDark } = useTheme();
  const { user } = useUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setLoading(true);

    try {
      // First verify current password by attempting to sign in
      if (!user?.email) {
        setError("User email not found");
        setLoading(false);
        return;
      }

      const { error: verifyError } = await signIn(user.email, currentPassword);

      if (verifyError) {
        setError("Current password is incorrect");
        setLoading(false);
        return;
      }

      // If verification succeeds, update password
      const { error: updateError } = await updatePassword(newPassword);

      if (updateError) {
        setError(updateError.message || "Failed to update password");
        setLoading(false);
      } else {
        setSuccess("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setLoading(false);
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update password");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2">
              Current Password
            </label>
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 pr-12 border border-border rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 bg-background text-foreground"
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className={`absolute right-3 top-[38px] ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {showCurrentPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 pr-12 border border-border rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 bg-background text-foreground"
              placeholder="Enter new password (min 6 characters)"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className={`absolute right-3 top-[38px] ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 pr-12 border border-border rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 bg-background text-foreground"
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute right-3 top-[38px] ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`p-3 rounded-xl ${isDark ? 'bg-red-500/10 border-red-700' : 'bg-red-50 border-red-200'} border`}>
              <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                {error}
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className={`p-3 rounded-xl ${isDark ? 'bg-green-500/10 border-green-700' : 'bg-green-50 border-green-200'} border`}>
              <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                {success}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full font-semibold  text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordChange;

