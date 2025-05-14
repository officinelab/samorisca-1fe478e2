
import React from "react";

interface EmptyStateProps {
  message: string;
  children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, children }) => (
  <div className="text-center py-8 text-gray-500">
    {message}
    {children}
  </div>
);

export default EmptyState;
