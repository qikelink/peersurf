import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface LogoCarouselProps {
  logos: Array<{
    id: string | number;
    src: string;
    alt: string;
    name?: string;
  }>;
  className?: string;
}

const LogoCarousel: React.FC<LogoCarouselProps> = ({ logos, className }) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (logoId: string | number) => {
    setFailedImages(prev => new Set(prev).add(logoId.toString()));
  };

  const renderLogo = (logo: any) => {
    const hasFailed = failedImages.has(logo.id.toString());

    if (hasFailed) {
      return (
        <div className="w-16 h-16 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
          {logo.alt.slice(0, 2).toUpperCase()}
        </div>
      );
    }

    return (
      <img
        src={logo.src}
        alt={logo.alt}
        className="w-16 h-16 rounded-lg object-cover shadow-md hover:shadow-lg transition-shadow"
        onError={() => handleImageError(logo.id)}
      />
    );
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="flex animate-scroll space-x-8">
        {/* Duplicate logos for seamless infinite scrolling */}
        {[...logos, ...logos, ...logos].map((logo, index) => (
          <div
            key={`${logo.id}-${index}`}
            className="flex-shrink-0 flex items-center justify-center"
          >
            <div className="flex flex-col items-center space-y-2">
              {renderLogo(logo)}
              {logo.name && (
                <span className="text-xs text-muted-foreground text-center max-w-16 truncate">
                  {logo.name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoCarousel;
