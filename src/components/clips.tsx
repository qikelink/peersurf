import { X } from "lucide-react";
import { Button } from "./ui/button";

type Video = {
  id: string;
  url: string;
};

// Sample video data
const sampleVideos: Video[] = [
  {
    id: "1",
    url: "https://jnoznbd6y3.ufs.sh/f/PKy8oE1GN2J3SmnPz9RHgldbCZqO68FamQULKyreIx24zPNs",
  },
  {
    id: "2",
    url: "https://jnoznbd6y3.ufs.sh/f/PKy8oE1GN2J3lTIr9DHZbTIX7esxfEnUPVZvO6kuH2GSdABY",
  },
  {
    id: "3",
    url: "https://jnoznbd6y3.ufs.sh/f/PKy8oE1GN2J3DiSg814MTEGgiO6oX4QaLukP0RZ8A7DSxUVW",
  },
];

interface ClipsPageProps {
  onBack: () => void;
}

const ClipsPage: React.FC<ClipsPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen relative my-12">
      {/* Clips stacked vertically */}
      <div className="flex flex-col w-full gap-10">
        {sampleVideos.map((video) => (
          <div key={video.id} className="w-full">
            <video
              src={video.url}
              autoPlay
              loop
              muted
              controls
              className="w-full h-[80vh] object-cover"
            />
          </div>
        ))}
      </div>

      {/* Back Button - Absolutely positioned at center bottom */}
      <Button
        onClick={onBack}
        variant={"secondary"}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 rounded-full p-4 z-50 h-12 w-12"
      >
        <X className="w-10 h-10" />
      </Button>
    </div>
  );
};

export default ClipsPage;
