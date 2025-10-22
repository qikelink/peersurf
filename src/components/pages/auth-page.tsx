import {
  useState,
  ReactNode,
  CSSProperties,
  MouseEvent,
  FormEvent,
  useEffect,
} from "react";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../ui/loader";


type SocialProvider = {
  name: string;
  id: string;
  icon: ReactNode;
};

const socialProviders: SocialProvider[] = [
  {
    name: "Google",
    id: "google",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
  },
  
];

type ButtonProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  variant?: "default" | "outline";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const Button = ({
  children,
  className = "",
  style = {},
  onClick,
  variant = "default",
  type = "button",
  disabled = false,
}: ButtonProps) => {
  const { isDark } = useTheme();
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variantClasses =
    variant === "outline"
      ? `border ${isDark ? 'border-gray-600 bg-gray-800 hover:bg-gray-700 text-white' : 'border-border bg-card hover:bg-muted text-foreground'}`
      : "text-white hover:opacity-90";

  return (
    <button
      className={`${baseClasses} ${variantClasses} h-12 py-2 px-4 ${className}`}
      style={style}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const AuthPage = () => {
  const location = useLocation();
  const initialMode = new URLSearchParams(location.search).get("mode");
  const [isSignUp, setIsSignUp] = useState<boolean>(initialMode === "signup");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<"talent" | "SPE" | "admin" | "">(() => {
    const r = new URLSearchParams(location.search).get("role");
    return r === "talent" || r === "SPE" || r === "admin" ? r : "";
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn, signUp, signInWithProvider, user } = useUser();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Update mode from query string when it changes
  useEffect(() => {
    const mode = new URLSearchParams(location.search).get("mode");
    setIsSignUp(mode === "signup");
    const r = new URLSearchParams(location.search).get("role");
    if (r === "talent" || r === "SPE" || r === "admin") setRole(r as "talent" | "SPE" | "admin");
  }, [location.search]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/opportunities");
  }, [user, navigate]);

  const handleSubmit = async (
    e: FormEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let result;
      if (isSignUp) {
        // Map role to the expected format
        const mappedRole = role === "SPE" ? "SPE" : role === "admin" ? "admin" : role === "talent" ? "talent" : undefined;
        result = await signUp(email, password, mappedRole);
      } else {
        result = await signIn(email, password);
      }
      if (result.error) {
        setError(result.error.message || "Authentication failed");
        setLoading(false);
      } else {
        setLoading(false);
        navigate("/opportunities");
      }
    } catch (err: any) {
      setError(err.message || "Authentication error");
      setLoading(false);
    }
  };

  const handleSocial = async (provider: string) => {
    setError(null);
    setLoading(true);
    try {
      await signInWithProvider(provider as any);
      setLoading(false);
      // Supabase will redirect, so no need to navigate
    } catch (err: any) {
      setError(err.message || "Social login error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1 px-6 flex flex-col justify-center items-center">
        {/* Auth Card */}
        <div className={`${isDark ? 'bg-gray-950 border-gray-700' : 'bg-card border-border'} rounded-2xl shadow-lg border p-8 relative z-10 max-w-md w-full mt-1`}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {isSignUp ? "Create Account" : "Sign In"}
            </h2>
            <p className="text-muted-foreground">
              {isSignUp
                ? "Join the decentralized video network"
                : "Welcome back, let's get started"}
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            {socialProviders.map((provider) => (
              <Button
                key={provider.id}
                className="w-full flex items-center justify-center gap-3 bg-card border border-border hover:bg-muted text-foreground"
                onClick={() => handleSocial(provider.id)}
                type="button"
              >
                {provider.icon}
                <span className={`${isDark ? 'text-gray-300' : 'text-foreground'}`}>Continue with {provider.name}</span>
              </Button>
            ))}
          </div>

          {/* Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-1 border-t border-border" />
              <span className="mx-3 text-muted-foreground text-sm">or</span>
              <div className="flex-1 border-t border-border" />
          </div>

          {/* Email/Password Form */}
          <form
            className="space-y-4"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            {isSignUp && (
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("talent")}
                  className={`p-3 rounded-xl border text-sm ${role === "talent" ? "border-green-500 bg-green-500/10 text-green-300" : "border-border bg-card text-foreground"}`}
                >
                  Talent
                </button>
                <button
                  type="button"
                  onClick={() => setRole("SPE")}
                  className={`p-3 rounded-xl border text-sm ${role === "SPE" ? "border-green-500 bg-green-500/10 text-green-300" : "border-border bg-card text-foreground"}`}
                >
                  SPE
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`p-3 rounded-xl border text-sm ${role === "admin" ? "border-green-500 bg-green-500/10 text-green-300" : "border-border bg-card text-foreground"}`}
                >
                  Admin
                </button>
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-border rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-background text-foreground placeholder:text-muted-foreground/70"
                required
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 pr-12 border border-border rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-background text-foreground placeholder:text-muted-foreground/70"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-muted-foreground hover:text-foreground'}`}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {error && (
              <div className={`p-3 rounded-xl ${isDark ? 'bg-red-500/10 border-red-700' : 'bg-red-50 border-red-200'} border`}>
                <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
              </div>
            )}

            <Button
              onClick={
                handleSubmit as (e: MouseEvent<HTMLButtonElement>) => void
              }
              className="w-full font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
              disabled={loading}
              type="submit"
            >
              {loading
                ? "Please wait..."
                : isSignUp
                ? "Create Account"
                : "Sign In"}
            </Button>
          </form>

          {loading && <Loader />}

          {/* Toggle Sign Up/In */}
          <div className="mt-6 text-center">
            <button
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              type="button"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-muted-foreground'}`}>
            By continuing, you agree to our{" "}
            <a href="/privacy" className={`underline hover:no-underline ${isDark ? 'text-gray-400 hover:text-green-400' : 'text-muted-foreground hover:text-primary'}`}>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className={`underline hover:no-underline ${isDark ? 'text-gray-400 hover:text-green-400' : 'text-muted-foreground hover:text-primary'}`}>
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
