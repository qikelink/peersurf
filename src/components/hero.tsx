import { useState } from "react";
import { Button } from "./ui/button";
import ClipsPage from "./clips";
import { Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type HeroProps = {
  onSeeClips?: () => void;
};

const Hero = ({ onSeeClips }: HeroProps) => {
  const [showClips, setShowClips] = useState(false);
  const [showEarlyAccess, setShowEarlyAccess] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSeeClips = () => {
    if (onSeeClips) {
      onSeeClips();
    } else {
      setShowClips(true);
    }
  };

  const handleBackToHero = () => {
    setShowClips(false);
  };

  const handleEarlyAccess = () => {
    setShowEarlyAccess(true);
  };

  const handleCloseDialog = () => {
    setShowEarlyAccess(false);
    setEmail("");
    setIsSubmitted(false);
    setIsLoading(false);
  };


  const handleSubmit = async (
    e?: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e) {
      if ("preventDefault" in e) e.preventDefault();
    }
    if (!email || !email.includes("@")) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.from("early_access").insert([
        {
          email: email,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error saving email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show clips page if active
  if (showClips) {
    return <ClipsPage onBack={handleBackToHero} />;
  }

  // Show hero page
  return (
    <>
      <div className="text-gray-900 font-inter max-w-5xl mx-auto mb-6 space-y-4 px-6 md:px-0 mt-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-semibold mb-6">
            Turn your daydream clip into viral video in one click
          </h1>
          <p className="text-gray-500">
            Unlimited costumizations, voiceovers, trending tracks, captions and
            more
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Button
              className="rounded-full p-6 font-semibold cursor-pointer"
              size={"lg"}
              variant={"secondary"}
            >
              Learn more
            </Button>
            <Button
              onClick={handleEarlyAccess}
              className="rounded-full p-6 font-semibold cursor-pointer"
              size={"lg"}
            >
              Early access
            </Button>
          </div>
        </div>
        {/* see clips */}
        <div className="flex flex-col items-center justify-center mt-24">
          <div className="relative w-56 h-32 mx-auto">
            {/* Card 1 - Bottom layer */}
            <div className="absolute inset-0 rounded-lg shadow-lg transform rotate-12 translate-x-3 translate-y-3 overflow-hidden">
              <img
                src="https://jnoznbd6y3.ufs.sh/f/PKy8oE1GN2J3HNtG8iXQIsuOrGyx047ZPgMSbYF5Jc3DpaqX?w=400&h=300&fit=crop"
                alt="Sample clip 1"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Card 2 - Middle layer */}
            <div className="absolute inset-0 rounded-lg shadow-lg transform rotate-[-12] -translate-x-1 translate-y-2 overflow-hidden">
              <img
                src="https://jnoznbd6y3.ufs.sh/f/PKy8oE1GN2J3YmVs2pj2v5fQiBSJGIMzDyA8UjRNs69HrewK?w=400&h=300&fit=crop"
                alt="Sample clip 3"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Card 3 - Back layer */}
            <div className="absolute inset-0 rounded-lg shadow-lg transform -rotate-8 translate-x-2 translate-y-1 overflow-hidden">
              <img
                src="https://jnoznbd6y3.ufs.sh/f/PKy8oE1GN2J31NoWq5iET2fntwWIyQsrmGjJ6oZROuD7HXek?w=400&h=300&fit=crop"
                alt="Sample clip 2"
                className="w-full h-full object-cover"
              />
            </div>
            {/* See Clips Button - Top layer, centered */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Button
                onClick={handleSeeClips}
                className="rounded-full font-medium hover:scale-105 transition-transform duration-200 cursor-pointer"
                variant={"secondary"}
              >
                See Clips
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Early Access Dialog */}
      {showEarlyAccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            {/* Close button */}
            <div className="flex justify-end p-4 pb-0">
              <button
                onClick={handleCloseDialog}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="sm:px-8 px-4 pb-8">
              {!isSubmitted ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                      Early Access
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Be among the first to try out ONYX!
                    </p>
                  </div>

                  {/* Form */}
                  <div className="space-y-6 px-4">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="
          w-full px-4 py-2.5 
          border-0 border-b border-gray-200 
          focus:outline-none focus:ring-0 
          focus:border-b-2 focus:border-gray-500 
          transition-all duration-200 placeholder:text-sm
          text-gray-900 placeholder-gray-400
        "
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSubmit(e);
                          }
                        }}
                      />
                    </div>

                    <Button
                      onClick={() => handleSubmit()}
                      disabled={isLoading || !email}
                      size={"lg"}
                      className="
        w-full py-3 rounded-md font-semibold 
       
        disabled:opacity-50 disabled:cursor-not-allowed 
        transition-all duration-200 cursor-pointer
      "
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Adding to waitlist...
                        </div>
                      ) : (
                        "Get Early Access"
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-gray-400 text-center mt-4">
                    We'll never spam you.
                  </p>
                </>
              ) : (
                /* Success State */
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="text-white" size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    You're on the list! 🎉
                  </h2>
                  <p className="text-gray-600 text-sm mb-2">
                    Thanks for joining! We've added{" "}
                    <span className="font-semibold text-gray-900">{email}</span>{" "}
                    to the waitlist.
                  </p>

                  <Button
                    onClick={handleCloseDialog}
                    className="px-8 py-2 rounded-xl mt-4 font-medium bg-gray-100 hover:bg-gray-200 text-gray-900 border-0 cursor-pointer"
                  >
                    Got it
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
