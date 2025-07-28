import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="w-full flex items-center justify-between py-6 px-8 max-w-7xl mx-auto">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-xl tracking-tight">Lisa</span>
      </div>
      {/* Centered Menu */}
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
        <a href="#" className="hover:text-black transition">
          Orchestrators
        </a>
        <a href="#" className="hover:text-black transition">
          How It Works
        </a>
        <a href="#" className="hover:text-black transition">
          FAQ
        </a>
      </div>
      {/* Get Started Button */}
      <div>
        <button
          onClick={() => navigate("/wallet")}
          className="font-medium py-2 flex "
        >
          Get started
          <span className="ml-2">→</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
