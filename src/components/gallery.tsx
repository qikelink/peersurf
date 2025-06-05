import { useState } from "react";
import { sampleGenerations } from "../lib/data";

import { Edit, ExternalLink, Share, X } from "lucide-react";
import ChatPromptGenerator from "./chat";

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

const Gallery: React.FC = () => {
  const [posts] = useState([...sampleGenerations]);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  // Add chat-related states
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [currentStyle, setCurrentStyle] = useState("");
  const [currentKeywords, setCurrentKeywords] = useState<string[]>([]);

  const handleCardClick = (index: number) => {
    
    setActiveCardIndex(index);
    setShowMenu(true);
  };

  const closeMenu = () => {
    setShowMenu(false);
    setActiveCardIndex(null);
  };

  const handleEditPrompt = () => {
    if (activeCardIndex !== null) {
      const post = sampleGenerations[activeCardIndex];

      setCurrentPrompt(post.excerpt);

      setCurrentStyle("");
      setCurrentKeywords([]);

      setChatDialogOpen(true);
    }
    closeMenu();
  };

  const handleSharePrompt = () => {
    if (activeCardIndex !== null) {
      const post = sampleGenerations[activeCardIndex];
      navigator.clipboard
        .writeText(post.link)
        .then(() => {
          setCopySuccess("Link copied! Share with friends");
          setTimeout(() => setCopySuccess(""), 2000);
        })
        .catch((err) => console.error("Failed to copy link:", err));
    }
    closeMenu();
  };

  const handleGoLive = () => {
    if (activeCardIndex !== null) {
      const post = sampleGenerations[activeCardIndex];
      window.open(post.link, "_blank", "noopener");
    }
    closeMenu();
  };

  return (
    <div className="relative font-gamja text-white px-6 py-10 h-full rounded-xl shadow-lg max-w-5xl mt-10 md:mt-16 mx-auto ">
      <div className="flex items-center mb-8">
        {/* <Link to="/" className="flex items-center text-green-400 hover:text-green-300 mr-4">
          <ArrowLeft size={20} className="mr-1" />
          Back
        </Link> */}
        <h1 className="text-xl md:text-2xl">Community Gallery</h1>
      </div>
      
      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <div
            key={`${post.id}-${index}`}
            className="relative bg-white/10 hover:opacity-80 rounded-lg shadow-md overflow-hidden h-[400px] cursor-pointer"
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
              <p className="text-white/50 line-clamp-2">
                {post.excerpt}
              </p>
            </div>
            
            {/* Menu overlay - shown when long pressed */}
             {showMenu && activeCardIndex === index && (
                <CardMenu
                  onClose={closeMenu}
                  onEdit={handleEditPrompt}
                  onShare={handleSharePrompt}
                  onGoLive={handleGoLive}
                />
              )}
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
    </div>
  );
};

export default Gallery;