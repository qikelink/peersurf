import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  LogOut, Bell, 
  LayoutDashboard, Target, 
  Users, BarChart3, Shield, Crown, UserCog, Briefcase, TrendingUp, Key, Trophy,
  X
} from "lucide-react";

const Sidebar = ({ 
  profile, 
  activeSection, 
  setActiveSection, 
  requestedRole, 
  handleRoleRequest, 
  navigate, 
  signOut,
  onClose
}: {
  profile: any;
  activeSection: string;
  setActiveSection: (section: string) => void;
  requestedRole: string | null;
  handleRoleRequest: (role: string) => void;
  navigate: any;
  signOut: () => Promise<void>;
  onClose?: () => void;
}) => {
  const getNavigationItems = () => {
    const baseItems = [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "bounties", label: "Post Bounty", icon: Target },
      { id: "grants", label: "Post Grant", icon: Briefcase },
      { id: "talent-hub", label: "Talent Hub", icon: Users },
    ];

    const speItems = [
      { id: "bounty-management", label: "Bounty Management", icon: Target },
      { id: "grant-management", label: "Grant Management", icon: Users },
      { id: "submission-management", label: "Submissions", icon: Trophy },
    ];

    const adminItems = [
      { id: "user-management", label: "User Management", icon: UserCog },
      { id: "ecosystem-analytics", label: "Ecosystem Analytics", icon: BarChart3 },
    ];

    return { baseItems, speItems, adminItems };
  };

  return (
    <div className="w-64 bg-card border-r border-border min-h-[calc(100vh-4rem)] lg:min-h-screen p-4 overflow-y-auto shadow-lg lg:shadow-none">
      {/* Mobile Close Button */}
      {onClose && (
        <div className="lg:hidden flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="bg-[#3366FF] text-white">
              {profile?.username?.slice(0, 2)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{profile?.full_name || profile?.username}</div>
            <Badge variant="secondary" className="text-xs capitalize">{profile?.role || "Talent"}</Badge>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {getNavigationItems().baseItems
          .filter((item) => {
            // Hide "Post Bounty" and "Post Grant" for talent users
            if (profile?.role === "talent" && (item.id === "bounties" || item.id === "grants")) {
              return false;
            }
            return true;
          })
          .map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "talent-hub") {
                  navigate("/talent");
                } else {
                  setActiveSection(item.id);
                }
                if (onClose) onClose(); // Close sidebar on mobile
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === item.id
                  ? "bg-[#3366FF] text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}

        {profile?.role === "talent" && (
          <>
            <div className="pt-4 pb-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                Talent Tools
              </div>
            </div>
            <button
              onClick={() => {
                setActiveSection("talent-progress");
                if (onClose) onClose(); // Close sidebar on mobile
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === "talent-progress"
                  ? "bg-[#3366FF] text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Talent Progress
            </button>
          </>
        )}

        {(profile?.role === "SPE" || profile?.role === "admin") && (
          <>
            <div className="pt-4 pb-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                SPE Management
              </div>
            </div>
            {getNavigationItems().speItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  if (onClose) onClose(); // Close sidebar on mobile
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === item.id
                    ? "bg-[#3366FF] text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </>
        )}

        {profile?.role === "admin" && (
          <>
            <div className="pt-4 pb-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                Admin Tools
              </div>
            </div>
            {getNavigationItems().adminItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  if (onClose) onClose(); // Close sidebar on mobile
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === item.id
                    ? "bg-[#3366FF] text-white"
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

      {profile?.role === "talent" && (
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
            <div className="mt-3 p-2 bg-[#3366FF]/10 border border-[#3366FF]/20 rounded text-xs text-[#3366FF]">
              Your role has been updated to {requestedRole} successfully!
            </div>
          )}
        </div>
      )}

      <div className="mt-8 space-y-2">
        <Button
          variant={activeSection === "password" ? "default" : "outline"}
          size="sm"
          className={`w-full justify-start ${activeSection === "password" ? "bg-[#3366FF] text-white" : ""}`}
          onClick={() => {
            setActiveSection("password");
            if (onClose) onClose(); // Close sidebar on mobile
          }}
        >
          <Key className="w-4 h-4 mr-2" />
          Change Password
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            navigate("/notifications");
            if (onClose) onClose(); // Close sidebar on mobile
          }}
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

export default Sidebar;


