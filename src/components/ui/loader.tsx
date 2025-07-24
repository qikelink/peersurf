import React from "react";

const Loader: React.FC<{ overlay?: boolean }> = ({ overlay = true }) => (
  <div
    className={
      overlay
        ? "fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-30"
        : "flex items-center justify-center"
    }
    style={{ minHeight: overlay ? "100vh" : undefined }}
  >
    <svg
      className="animate-spin h-12 w-12 text-green-700"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  </div>
);

export default Loader; 