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
import { useNavigate } from "react-router-dom";
import Loader from "../ui/loader";

// Livepeer green colors
const LIVEPEER_GREEN = "#006400";

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
  {
    name: "X",
    id: "twitter",
    // The issue: The "fill-current" class on the SVG expects a parent with a text color (e.g. text-gray-700) to set the fill color.
    // However, the parent Button uses "text-gray-700", but the SVG itself does not have an explicit fill color.
    // If the Button's text color is overridden (e.g. by a child span), the SVG may inherit an unexpected color or none at all.
    // To ensure the icon is visible, set the fill color directly on the <svg> or <path>.
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1D9BF0">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variantClasses =
    variant === "outline"
      ? "border border-gray-300 bg-background hover:bg-gray-50"
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
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn, signUp, signInWithProvider, user } = useUser();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/wallet");
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
        result = await signUp(email, password);
      } else {
        result = await signIn(email, password);
      }
      if (result.error) {
        setError(result.error.message || "Authentication failed");
        setLoading(false);
      } else {
        setLoading(false);
        navigate("/wallet");
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
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-6 flex flex-col justify-center items-center">
        {/* Auth Card */}
        <div
          className="bg-white rounded-2xl shadow-lg border-0 p-6 -mt-6 relative z-10"
          style={{
            background: "#F6FFF9",
            border: "1px solid #C6F7E2",
          }}
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {isSignUp ? "Create Account" : "Sign In"}
            </h2>
            <p className="text-sm text-gray-600">
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
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                onClick={() => handleSocial(provider.id)}
                type="button"
              >
                {provider.icon}
                <span className="text-gray-600">Continue with {provider.name}</span>
              </Button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="mx-3 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Email/Password Form */}
          <form
            className="space-y-4"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[--livepeer-green] focus:border-transparent bg-white text-gray-900"
                style={
                  { "--livepeer-green": LIVEPEER_GREEN } as React.CSSProperties
                }
                required
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[--livepeer-green] focus:border-transparent bg-white text-gray-900"
                style={
                  { "--livepeer-green": LIVEPEER_GREEN } as React.CSSProperties
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={
                handleSubmit as (e: MouseEvent<HTMLButtonElement>) => void
              }
              className="w-full font-semibold"
              style={{ background: LIVEPEER_GREEN }}
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
              className="text-sm text-gray-600 hover:underline"
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
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:no-underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:no-underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
