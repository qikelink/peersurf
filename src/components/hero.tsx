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
