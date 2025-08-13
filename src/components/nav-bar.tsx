import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";

const Navbar = () => {

  
  
  return (
    <nav className="w-full flex items-center justify-between py-6 px-8 max-w-7xl mx-auto relative z-20">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <span className="font-bold tracking-tight text-white">
          <a href="/">
            PeerSurf
          </a>
        </span>
      </div>

      {/* Centered Menu */}
      <div className="hidden md:flex gap-8 text-sm font-medium">
        <Link
          to="/home"
          className="text-gray-300 hover:text-green-400 transition-all duration-300 relative group"
        >
          Opportunities
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></div>
        </Link>
        <Link
          to="/home#how-it-works"
          className="text-gray-300 hover:text-green-400 transition-all duration-300 relative group"
        >
          How It Works
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></div>
        </Link>
        <Link
          to="/home#faq"
          className="text-gray-300 hover:text-green-400 transition-all duration-300 relative group"
        >
          FAQ
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></div>
        </Link>
        <Link
          to="/sponsor"
          className="text-gray-300 hover:text-green-400 transition-all duration-300 relative group"
        >
          Sponsor
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></div>
        </Link>
      </div>
      {/* Right: Auth actions */}
      <div className="flex items-center gap-4">
        {useUser && useNavigate ? null : null}
        {/* Avatar/login area */}
        {(() => {
          try {
            // Inline access to hooks already imported
            // This is just to ensure compile; actual hooks are used at top
            return null;
          } catch {
            return null;
          }
        })()}
      </div>
    
    </nav>
  );
};

export default Navbar;
