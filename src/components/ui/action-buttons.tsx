import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./button";
import { Plus, Calculator, CreditCard, Home } from "lucide-react";

const LIVEPEER_GRADIENT = "linear-gradient(135deg, #006400 0%, #00EB88 100%)";
const LIVEPEER_GREEN = "#006400";
const ACTION_BUTTONS_HEIGHT = 104;


const actions = [
  {
    label: "Home",
    icon: (isActive: boolean) => (
      <Home className={`w-4 h-4 ${isActive ? "text-white" : "text-[#006400]"}`} />
    ),
    path: "/wallet",
  },
  {
    label: "Add Funds",
    icon: (isActive: boolean) => (
      <Plus className={`w-4 h-4 ${isActive ? "text-white" : "text-[#006400]"}`} />
    ),
    path: "/funding",
  },
  {
    label: "Calculator",
    icon: (isActive: boolean) => (
      <Calculator className={`w-4 h-4 ${isActive ? "text-white" : "text-[#006400]"}`} />
    ),
    path: "/calculator",
  },
  {
    label: "Cards",
    icon: (isActive: boolean) => (
      <CreditCard className={`w-4 h-4 ${isActive ? "text-white" : "text-[#006400]"}`} />
    ),
    path: "/cards",
    comingSoon: true,
  },
];

const ActionButtons: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-20 bg-white"
      style={{
        // Remove boxShadow for no shadow
        boxShadow: "none",
        paddingTop: 0,
        paddingBottom: 0,
        height: `${ACTION_BUTTONS_HEIGHT}px`,
      }}
    >
      <div
        className="w-full overflow-x-auto px-0"
        style={{
          // Hide scrollbars for all browsers
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE 10+
        }}
      >
        <style>
          {`
            /* Hide scrollbar for Chrome, Safari and Opera */
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        <div className="flex gap-3 px-4 min-w-[400px] md:min-w-0 h-[88px] items-center justify-center hide-scrollbar"
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {actions.map((action) => {
            const isActive = location.pathname.startsWith(action.path);
            const isComingSoon = action.comingSoon;
            return (
              <div
                key={action.path}
                className="relative flex flex-col items-center justify-end min-w-[85px]"
                style={{ height: "88px" }}
              >
                <Button
                  className={`group flex flex-col items-center justify-center gap-1.5 px-4 pt-4 rounded-2xl w-full transition-all duration-300 relative overflow-visible ${
                    isActive
                      ? "bg-[#006400] text-white scale-[1.01]"
                      : "bg-white text-[#006400] hover:scale-[1.01]"
                  }`}
                  style={{
                    border: "none",
                    flex: "0 0 75px",
                    height: "50px",
                    background: isActive ? LIVEPEER_GRADIENT : "white",
                    color: isActive ? "white" : LIVEPEER_GREEN,
                    boxShadow: "none", // Remove shadow from button
                  }}
                  onClick={() => navigate(action.path)}
                  aria-label={action.label + (isComingSoon ? " (Coming Soon)" : "")}
                >
                  <div className="p-1.5 rounded-lg flex items-center justify-center">
                    {action.icon(isActive)}
                  </div>
                  <span className="text-[11px] font-medium">
                    {action.label}
                  </span>
                </Button>
                {isComingSoon && (
                  <span
                    className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.02em",
                      zIndex: 2,
                      pointerEvents: "none",
                    }}
                    aria-hidden="true"
                  >
                     Soon
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActionButtons; 