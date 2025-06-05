// src/components/LatestContent.tsx
import { useEffect, useRef, useState } from "react";
import { sampleGenerations } from "../lib/data";
import { Edit, Share, X, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import ChatPromptGenerator from "./chat"; // Add this import

interface CardMenuProps {
  onClose: () => void;
  onEdit: () => void;
  onShare: () => void;
  onGoLive: () => void;
}

const CardMenu: React.FC<CardMenuProps> = ({
  onClose,
  onEdit,
  onShare,
  onGoLive,
}) => {
  return (
    <div
      className="absolute inset-0 bg-black/75 flex flex-col justify-center items-center rounded-lg z-10"
      onClick={(e) => e.stopPropagation()} // prevent closing by parent
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-2 right-2 text-white/70 hover:text-white"
      >
        <X size={24} />
      </button>

      <div className="flex flex-col gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onGoLive();
          }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors"
        >
          <ExternalLink size={20} />
          Preview on daydream.live
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-colors"
        >
          <Edit size={20} />
          Edit prompt in chat
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onShare();
          }}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors"
        >
          <Share size={20} />
          Share on socials
        </button>
      </div>
    </div>
  );
};

const LatestContent: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [posts] = useState(sampleGenerations);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  // Add chat-related states
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [currentStyle, setCurrentStyle] = useState("");
  const [currentKeywords, setCurrentKeywords] = useState<string[]>([]);

  // Auto-scrolling effect
  useEffect(() => {
    if (!scrollContainerRef.current || posts.length === 0 || isPaused) return;
    const scrollContainer = scrollContainerRef.current;
    let animationId: number;
    let position = 0;
    const scroll = () => {
      position += 0.5;
      if (position >= scrollContainer.scrollWidth / 2) {
        position = 0;
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft = position;
      }
      animationId = requestAnimationFrame(scroll);
    };
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [posts, isPaused]);

  const handleCardClick = (index: number) => {
    setIsPaused(true);
    setActiveCardIndex(index);
    setShowMenu(true);
  };

  const closeMenu = () => {
    setShowMenu(false);
    setIsPaused(false);
    setActiveCardIndex(null);
  };

  const handleEditPrompt = () => {
    if (activeCardIndex !== null) {
      const post = displayPosts[activeCardIndex];

      setCurrentPrompt(post.excerpt);

      setCurrentStyle("");
      setCurrentKeywords([]);

      setChatDialogOpen(true);
    }
    closeMenu();
  };

  const handleSharePrompt = () => {
    if (activeCardIndex !== null) {
      const post = displayPosts[activeCardIndex];
      navigator.clipboard
        .writeText(post.link)
        .then(() => {
          setCopySuccess("Link copied!");
          setTimeout(() => setCopySuccess(""), 2000);
        })
        .catch((err) => console.error("Failed to copy link:", err));
    }
    closeMenu();
  };

  const handleGoLive = () => {
    if (activeCardIndex !== null) {
      const post = displayPosts[activeCardIndex];
      window.open(post.link, "_blank", "noopener");
    }
    closeMenu();
  };

  const displayPosts = [...posts, ...posts, ...posts];

  return (
    <div className="relative overflow-hidden bg-black text-white font-gamja max-w-5xl mx-auto mb-6 mt-8 space-y-4 px-6 md:px-0">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-3xl">From the community</h2>
        <Link
          to="/community"
          className="text-green-400 hover:text-green-300 text-sm md:text-base"
        >
          View all
        </Link>
      </div>

      {/* Carousel container */}
      <div
        className="overflow-x-auto whitespace-nowrap pb-4 no-scrollbar"
        ref={scrollContainerRef}
      >
        {displayPosts.map((post, index) => (
          <div
            key={`${post.id}-${index}`}
            className="inline-block mx-2 align-top"
          >
            <div
              className="relative bg-white/10 hover:opacity-80 rounded-lg shadow-md overflow-hidden block w-64 md:w-72 h-[400px] md:h-[500px] cursor-pointer"
              onClick={() => handleCardClick(index)}
            >
              {/* Video background */}
              <div className="h-[75%]">
                <video
                  src={post.image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="text-lg text-white font-semibold mb-1">
                  {post.title}
                </h3>
                <p className="text-white/50 whitespace-normal line-clamp-2">
                  {post.excerpt}
                </p>
              </div>

              {/* Menu overlay */}
              {showMenu && activeCardIndex === index && (
                <CardMenu
                  onClose={closeMenu}
                  onEdit={handleEditPrompt}
                  onShare={handleSharePrompt}
                  onGoLive={handleGoLive}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Copy success message */}
      {copySuccess && (
        <div className="absolute top-0 right-0 bg-green-600 text-white py-2 px-4 rounded-md shadow-md">
          {copySuccess}
        </div>
      )}

      {/* Chat Dialog Component */}
      {chatDialogOpen && (
        <ChatPromptGenerator
          isOpen={chatDialogOpen}
          onClose={() => setChatDialogOpen(false)}
          initialPrompt={currentPrompt}
          style={currentStyle}
          keywords={currentKeywords}
          onSavePrompt={() => {
            setChatDialogOpen(false);
          }}
        />
      )}

      {/* Profile Section */}
      <section className="flex flex-col items-center justify-center mt-10">
        <div className="flex items-center space-x-2">
          <img src="/livepeer.webp" alt="Daydream Live" className="w-6 h-6" />
           <p className="text-base">Powered by livepeer</p>
        </div>
      </section>
    </div>
  );
};

export default LatestContent;
