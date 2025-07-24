import React from "react";

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, icon, children }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
    {icon && <div className="mb-4 text-5xl text-gray-300">{icon}</div>}
    <div className="text-lg font-semibold mb-2">{message}</div>
    {children}
  </div>
);

export default EmptyState; 