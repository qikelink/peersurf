import { ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mx-auto text-gray-900 font-inter text-sm mt-36 mb-16">
      <div className="container mx-auto px-6">
        {/* Top Image */}
        <div className="flex justify-center mb-24 px-24">
          <img src="/onyx-1.png" />
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          {/* Column 1 - Email Button */}
          <div className="flex flex-col items-center md:items-start">
            <Button
              variant={"secondary"}
              className="w-full md:w-auto p-6 text-black rounded-full font-semibold cursor-pointer"
              onClick={() => (window.location.href = "mailto:hi@hionyx.pages.dev")}
            >
              E-mail
            </Button>
          </div>

          {/* Column 2 - Company */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-gray-400 font-medium">Company</h3>
            <div className="space-y-3">
              <a
                href="#"
                className="block text-gray-800 font-medium hover:text-gray-900 transition-colors duration-200 cursor-pointer"
              >
                Work
              </a>
              <a
                href="#"
                className="block text-gray-800 font-medium hover:text-gray-900 transition-colors duration-200 cursor-pointer"
              >
                Pricing
              </a>
              <a
                href="#"
                className="block text-gray-800 font-medium hover:text-gray-900 transition-colors duration-200 cursor-pointer"
              >
                FAQ
              </a>
            </div>
          </div>

          {/* Column 3 - Let's Connect */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-gray-400 font-medium">Let's Connect</h3>
            <div className="space-y-3">
              <a
                href="https://x.com/onyx_video"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 font-medium hover:text-gray-900 transition-colors duration-200 cursor-pointer flex items-end gap-0.5"
              >
                X
                <ArrowUpRight size={16} />
              </a>
              <a
                href="https://discord.gg/qVktYgHfZR"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 font-medium hover:text-gray-900 transition-colors duration-200 cursor-pointer flex items-end gap-0.5"
              >
                Discord
                <ArrowUpRight size={16} />
              </a>
              <a
                href="https://linktr.ee/onyx_editor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 font-medium hover:text-gray-900 transition-colors duration-200 cursor-pointer flex items-end gap-0.5"
              >
                Linktree
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright - Right aligned */}
        <div>
          <div className="flex justify-start">
            <p className="text-gray-400 text-sm font-medium">© {currentYear} ONYX Video</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
