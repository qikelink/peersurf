import { useRef, useEffect } from "react";

// Only flags and country names are needed
const currencies = [
  { country: "United States", flag: "🇺🇸" },
  { country: "European Union", flag: "🇪🇺" },
  { country: "United Kingdom", flag: "🇬🇧" },
  { country: "Japan", flag: "🇯🇵" },
  { country: "Nigeria", flag: "🇳🇬" },
  { country: "India", flag: "🇮🇳" },
  { country: "Canada", flag: "🇨🇦" },
  { country: "Australia", flag: "🇦🇺" },
  { country: "Brazil", flag: "🇧🇷" },
  { country: "South Korea", flag: "🇰🇷" },
  { country: "South Africa", flag: "🇿🇦" },
  { country: "Turkey", flag: "🇹🇷" },
  { country: "Mexico", flag: "🇲🇽" },
  { country: "Singapore", flag: "🇸🇬" },
  { country: "Switzerland", flag: "🇨🇭" },
  { country: "Sweden", flag: "🇸🇪" },
  { country: "Saudi Arabia", flag: "🇸🇦" },
  { country: "Argentina", flag: "🇦🇷" },
  { country: "Indonesia", flag: "🇮🇩" },
  { country: "Vietnam", flag: "🇻🇳" },
  { country: "United Arab Emirates", flag: "🇦🇪" },
  { country: "Hong Kong", flag: "🇭🇰" },
];

const carouselItems = [...currencies, ...(currencies.length < 50 ? [] : [])];

// Duplicate the items for seamless infinite scroll
const duplicatedItems = [...carouselItems, ...carouselItems];

export const Currencies = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationFrame: number;
    let start: number | null = null;

    // Wait for layout to ensure scrollWidth is correct
    setTimeout(() => {
      const scrollWidth = carousel.scrollWidth / 2; // since we duplicated
      const speed = 0.2; // px per ms (slower than before)

      function step(timestamp: number) {
        if (!carousel) return;
        if (start === null) start = timestamp;
        if (carousel.scrollLeft >= scrollWidth) {
          carousel.scrollLeft = 0;
          start = timestamp;
        } else {
          carousel.scrollLeft = carousel.scrollLeft + speed;
        }
        animationFrame = requestAnimationFrame(step);
      }

      animationFrame = requestAnimationFrame(step);
    }, 50);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <footer className="w-full max-w-7xl mx-auto py-12 px-8 flex flex-col items-center">
      <div className="text-[oklch(0.22_0.13_145)] dark:text-[oklch(0.65_0.18_145)] text-base font-medium mb-6 text-center">
        <span className="text-sm text-gray-500 font-normal">
          Up to 50+ supported currencies for seamless staking and rewards.
        </span>
      </div>
      <div
        className="relative w-full overflow-x-hidden"
        style={{ maxWidth: "100vw" }}
      >
        <div
          ref={carouselRef}
          className="flex flex-nowrap items-center gap-6 no-scrollbar"
          style={{
            minWidth: `${duplicatedItems.length * 30}px`, // 40px per item, adjust as needed
            overflow: "auto",
            scrollBehavior: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {duplicatedItems.map((c, i) => (
            <div
              key={c.country + "-" + i}
              className="flex flex-col items-center justify-center transition-transform"
              title={c.country}
              style={{
                flex: "0 0 64px", 
                aspectRatio: "1/1",
                background: "none",
              }}
            >
              <span className="text-4xl mb-1">{c.flag}</span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Currencies;
