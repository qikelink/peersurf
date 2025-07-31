import React, { useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";
import { Mail, QrCode } from "lucide-react";
import Loader from "../ui/loader";

const PrivyAuthPage: React.FC = () => {
  const { login, authenticated, ready } = usePrivy();
  const navigate = useNavigate();

  // Redirect if already authenticated (embedded wallets are created automatically)
  const redirectToWallet = useCallback(() => {
    if (ready && authenticated) {
      navigate("/wallet");
    }
  }, [ready, authenticated, navigate]);

  React.useEffect(() => {
    redirectToWallet();
  }, [redirectToWallet]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (!ready) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-green-50 text-black font-sans flex items-center justify-center px-4">
      <div className="max-w-md w-full p-4 bg-white rounded-xl shadow space-y-6 border border-gray-100">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-4">
            <img src="/onyx.png" alt="Lisa" className="w-16 h-16" />
          </div>
          <div className="font-semibold text-lg leading-tight">
            Welcome to Lisa
          </div>
          <div className="text-sm text-gray-500">
            Connect your wallet or sign in with email
          </div>
        </div>

        {/* Login option */}
        <div className="space-y-4">
         

          <button
            onClick={() => handleLogin()}
            className="w-full flex items-center gap-4 rounded-xl p-4 border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-black text-base">
                Sign in with Email
              </div>
              <div className="text-xs text-gray-600">
                Create account or sign in with email
              </div>
            </div>
          </button>

          <button
            onClick={() => handleLogin()}
            className="w-full flex items-center gap-4 rounded-xl p-4 border border-gray-200 bg-gray-50 hover:bg-gray-100  transition"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
              <QrCode className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-black text-base">
                Sign in withSocial 
              </div>
              <div className="text-xs text-gray-600">
                Connect with Google, Apple, or SMS
              </div>
            </div>
          </button>
        </div>

        {/* Terms */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <a href="#" className="text-green-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-green-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivyAuthPage;
