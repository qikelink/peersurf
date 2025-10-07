import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useUser();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getActiveStyles = (isActiveLink: boolean) => {
    if (isActiveLink) {
      return isDark 
        ? "text-white font-semibold" 
        : "text-primary font-semibold";
    }
    return "text-muted-foreground hover:text-primary";
  };

  const getMobileActiveStyles = (isActiveLink: boolean) => {
    if (isActiveLink) {
      return isDark 
        ? "text-white font-semibold bg-gray-800" 
        : "text-primary font-semibold bg-gray-100";
    }
    return "text-muted-foreground hover:text-primary hover:bg-muted";
  };

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    navigate("/auth?mode=login");
  };

  return (
    <nav className="w-full bg-background border-b border-border text-foreground sticky top-0 z-50">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src="/onyx.png" alt="PeerSurf" className="w-8 h-8" />
              <span className="font-bold text-lg sm:text-xl text-foreground tracking-tight">PeerSurf</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            
            <Link 
              to="/" 
              className={`transition-colors ${getActiveStyles(isActive("/"))}`}
            >
              Home
            </Link> 
            <Link 
              to="/opportunities" 
              className={`transition-colors ${getActiveStyles(isActive("/opportunities"))}`}
            >
              Opportunities Hub
            </Link>
            <Link 
              to="/talent" 
              className={`transition-colors ${getActiveStyles(isActive("/talent"))}`}
            >
              Talent Hub
            </Link>
            <Link 
              to="/community" 
              className={`transition-colors ${getActiveStyles(isActive("/community"))}`}
            >
              Community
            </Link>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-300 hover:text-green-400 transition-colors"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 focus:outline-none"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="bg-green-700 text-white">
                      {(profile?.username || user?.email || "U").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-2 z-50">
                    <button
                      className="w-full text-left px-4 py-2 text-foreground hover:bg-muted"
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/profile");
                      }}
                    >
                      Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-foreground hover:bg-muted"
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/notifications");
                      }}
                    >
                      Notifications
                    </button>
                    <hr className="border-gray-700 my-1" />
                    <button
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-muted"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                onClick={() => navigate("/auth?mode=signup")}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-lg"
              >
                Launch App
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
              </div>
              
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-sm transition-colors ${getMobileActiveStyles(isActive("/"))}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/opportunities"
              className={`block px-3 py-2 rounded-sm transition-colors ${getMobileActiveStyles(isActive("/opportunities"))}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Opportunities Hub
            </Link>
            <Link
              to="/talent"
              className={`block px-3 py-2 rounded-sm transition-colors ${getMobileActiveStyles(isActive("/talent"))}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Talent Hub
            </Link>
            <Link
              to="/community"
              className={`block px-3 py-2 rounded-sm transition-colors ${getMobileActiveStyles(isActive("/community"))}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Community
            </Link>
            <hr className="border-gray-700 my-2" />
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/notifications"
                  className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Notifications
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="block w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-muted rounded-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/auth?mode=signup");
                }}
                className="block w-full px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-sm text-center"
              >
                Launch App
              </button>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close menus */}
      {(userMenuOpen || mobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setUserMenuOpen(false);
            setMobileMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;