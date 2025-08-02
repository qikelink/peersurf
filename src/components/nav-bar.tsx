import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="w-full flex items-center justify-between py-6 px-8 max-w-7xl mx-auto relative z-20">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <span className="font-bold tracking-tight text-white">
          PeerSurf
        </span>
      </div>

      {/* Centered Menu */}
      <div className="hidden md:flex gap-8 text-sm font-medium">
        <a
          href="#"
          className="text-gray-300 hover:text-green-400 transition-all duration-300 relative group"
        >
          Opportunities
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></div>
        </a>
        <a
          href="#"
          className="text-gray-300 hover:text-green-400 transition-all duration-300 relative group"
        >
          How It Works
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></div>
        </a>
        <a
          href="#"
          className="text-gray-300 hover:text-green-400 transition-all duration-300 relative group"
        >
          FAQ
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></div>
        </a>
      </div>

    
    </nav>
  );
};

export default Navbar;
