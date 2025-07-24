import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto py-20 px-8 min-h-[70vh]">
      {/* Left: Text */}
      <div className="flex-1 flex flex-col items-start justify-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-semibold mb-8 leading-tight text-black">
          The Easiest Way to
          <br />
          Earn Onchain.
        </h1>
        <div className="mb-8 text-gray-700 text-lg max-w-md">
          With Lisa, you can delegate and earn rewards using your local
          currency. No need to buy crypto, pay for gas, or navigate complex
          platforms.
        </div>
        <div className="flex items-center gap-4 mb-10">
          <button
            className="bg-green-700 hover:bg-green-600 text-white cursor-pointer font-semibold px-7 py-3 rounded-full transition"
            onClick={() => navigate("/wallet")}
          >
            Get Started
          </button>
          <button className="text-gray-700 hover:text-black text-sm cursor-pointer font-medium px-4 py-3 rounded-full transition flex items-center gap-1">
            Learn more <span className="ml-1">→</span>
          </button>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl md:text-5xl font-bold text-green-700">
            65.3%
          </span>
          <span className="text-2xl md:text-3xl font-medium text-black">
            APY
          </span>
        </div>
      </div>
      {/* Right: 3D Card Illustration Placeholder */}
      <div className="flex-1 flex flex-col items-center justify-center relative mt-16 md:mt-0">
        {/* 3D Card Placeholder */}
        <div className="relative w-[320px] h-[220px]">
          {/* Simulate stacked cards with gradients */}
          <div className="absolute top-8 left-8 w-full h-full rounded-3xl bg-gradient-to-br from-green-200 to-green-400 opacity-60 blur-sm"></div>
          <div className="absolute top-4 left-4 w-full h-full rounded-3xl bg-gradient-to-br from-green-300 to-green-600 opacity-80 blur-[2px]"></div>
          <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-green-400 to-green-800 shadow-2xl border-2 border-white"></div>
          {/* <img src="/hero.png" className="h-full w-full" /> */}
        </div>
        {/* <span className="mt-6 text-gray-400 text-base">Powered by Livepeer</span> */}
      </div>
    </section>
  );
};

export default Hero;
