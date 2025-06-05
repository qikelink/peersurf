import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Hero = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sample video URLs - replace with your actual video URLs
  const sampleVideos = [
    {
      id: 1,
      title: "Sample Clip 1",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
    {
      id: 2,
      title: "Sample Clip 2",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    },
    {
      id: 3,
      title: "Sample Clip 3",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
  ];

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % sampleVideos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex(
      (prev) => (prev - 1 + sampleVideos.length) % sampleVideos.length
    );
  };

  return (
    <div className=" text-gray-900 font-inter max-w-5xl mx-auto mb-6 space-y-4 px-6 md:px-0 mt-20">
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
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop"
              alt="Sample clip 1"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Card 2 - Middle layer */}
          <div className="absolute inset-0 rounded-lg shadow-lg transform -rotate-8 translate-x-2 translate-y-1 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop"
              alt="Sample clip 2"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Card 3 - Back layer */}
          <div className="absolute inset-0 rounded-lg shadow-lg transform rotate-6 -translate-x-1 translate-y-2 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=400&h=300&fit=crop"
              alt="Sample clip 3"
              className="w-full h-full object-cover"
            />
          </div>

          {/* See Clips Button - Top layer, centered */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="rounded-full font-medium hover:scale-105 transition-transform duration-200 cursor-pointer"
                  variant={"secondary"}
                >
                  See Clips
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl w-full h-[60vh] p-0 border-0">
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  {/* Video Container */}
                  <div className="relative w-full h-full mx-auto">
                    <video
                      key={sampleVideos[currentVideoIndex].id}
                      src={sampleVideos[currentVideoIndex].url}
                      autoPlay
                      loop
                      muted
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Navigation Buttons */}
                  <Button
                    onClick={prevVideo}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full p-3 bg-black bg-opacity-50 hover:bg-opacity-75 text-white border-0"
                    variant="ghost"
                    size="sm"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>

                  <Button
                    onClick={nextVideo}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full p-3 bg-black bg-opacity-50 hover:bg-opacity-75 text-white border-0"
                    variant="ghost"
                    size="sm"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>

                  {/* Video Indicator Dots */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-gray-800 px-2 py-1.5 rounded-full">
                    {sampleVideos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentVideoIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                          index === currentVideoIndex
                            ? "bg-white"
                            : "bg-white bg-opacity-50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
