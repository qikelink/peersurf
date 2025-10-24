import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden hero-section optimized-scroll">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-background">
        {/* Stars - Optimized with CSS */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/5 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Cosmic Rays - Optimized */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/4 w-px h-full bg-gradient-to-b from-transparent via-green-700 to-transparent transform rotate-12"></div>
          <div className="absolute left-1/2 w-px h-full bg-gradient-to-b from-transparent via-green-700 to-transparent transform -rotate-12"></div>
          <div className="absolute right-1/4 w-px h-full bg-gradient-to-b from-transparent via-green-700 to-transparent transform rotate-6"></div>
        </div>

        {/* Crystal Balls - Simplified */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top-left */}
          <div className="absolute left-8 top-12 w-32 h-32 rounded-full bg-gradient-to-br from-green-400/10 to-blue-400/10 border border-white/5 animate-float"></div>
          {/* Top-right */}
          <div className="absolute right-10 top-20 w-24 h-24 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 border border-white/5 animate-float" style={{animationDelay: "1s"}}></div>
          {/* Center-left */}
          <div className="absolute left-12 top-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-purple-400/10 to-green-400/10 border border-white/5 animate-float" style={{animationDelay: "0.5s"}}></div>
          {/* Center-right */}
          <div className="absolute right-14 top-1/2 w-36 h-36 rounded-full bg-gradient-to-br from-green-400/10 to-blue-400/10 border border-white/5 animate-float" style={{animationDelay: "1.5s"}}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 text-center">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-6xl font-bold mb-8 leading-tight text-foreground">
          Discover
          <br />
          <span>Opportunities on</span>
          <br />
          <span className="inline-block relative">
            Livepeer Ecosystem
            <span
              className="absolute left-0 right-0 -bottom-1 h-1 bg-green-500 rounded"
              style={{ zIndex: -1 }}
            ></span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Join the talent layer of
          livepeer. Contribute as a developer, creator, artist or writer. Earn rewards and
          help shape the future of decentralized video.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg  cursor-pointer hover:shadow-green-500/25"
            onClick={() => navigate("/opportunities")}
          >
            Start Building
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
