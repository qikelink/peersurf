import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-black">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Cosmic Rays */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-full bg-gradient-to-b from-transparent via-green-700 to-transparent opacity-20"
              style={{
                left: `${i * 12.5 + Math.random() * 10}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>

        {/* Crystal Balls */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top-left */}
          <div
            className="absolute rounded-full bg-gradient-to-br from-green-400/20 via-blue-400/10 to-purple-400/20 backdrop-blur-xl border border-white/10 shadow-[0_0_60px_-15px_rgba(0,235,136,0.5)] animate-float"
            style={{ left: "8%", top: "12%", width: 140, height: 140, animationDelay: "0.2s", animationDuration: "7s" }}
          />
          {/* Top-right */}
          <div
            className="absolute rounded-full bg-gradient-to-br from-blue-400/20 via-purple-400/10 to-green-400/20 backdrop-blur-xl border border-white/10 shadow-[0_0_70px_-15px_rgba(0,180,255,0.45)] animate-float"
            style={{ right: "10%", top: "18%", width: 110, height: 110, animationDelay: "1.1s", animationDuration: "6.5s" }}
          />
          {/* Center-left */}
          <div
            className="absolute rounded-full bg-gradient-to-br from-purple-400/20 via-green-400/10 to-blue-400/20 backdrop-blur-xl border border-white/10 shadow-[0_0_80px_-15px_rgba(147,51,234,0.4)] animate-float"
            style={{ left: "12%", top: "48%", width: 180, height: 180, animationDelay: "0.6s", animationDuration: "8s" }}
          />
          {/* Center-right */}
          <div
            className="absolute rounded-full bg-gradient-to-br from-green-400/20 via-blue-400/10 to-purple-400/20 backdrop-blur-xl border border-white/10 shadow-[0_0_80px_-15px_rgba(0,235,136,0.4)] animate-float"
            style={{ right: "14%", top: "52%", width: 160, height: 160, animationDelay: "1.8s", animationDuration: "7.5s" }}
          />
          {/* Bottom-left */}
          <div
            className="absolute rounded-full bg-gradient-to-br from-blue-400/20 via-purple-400/10 to-green-400/20 backdrop-blur-xl border border-white/10 shadow-[0_0_70px_-15px_rgba(59,130,246,0.45)] animate-float"
            style={{ left: "18%", bottom: "8%", width: 120, height: 120, animationDelay: "1.4s", animationDuration: "6.8s" }}
          />
          {/* Bottom-right */}
          <div
            className="absolute rounded-full bg-gradient-to-br from-purple-400/20 via-green-400/10 to-blue-400/20 backdrop-blur-xl border border-white/10 shadow-[0_0_90px_-15px_rgba(147,51,234,0.45)] animate-float"
            style={{ right: "12%", bottom: "10%", width: 190, height: 190, animationDelay: "0.9s", animationDuration: "8.5s" }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 text-center">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-white">
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
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Join the talent layer of
          livepeer. Contribute as a developer, creator, artist or writer. Earn rewards and
          help shape the future of decentralized video.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg  cursor-pointer hover:shadow-green-500/25"
            onClick={() => navigate("/home")}
          >
            Start Building
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
