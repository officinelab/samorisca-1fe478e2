
import React from 'react';

export const PublicMenuLoadingState: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-50">
      <div className="animate-pulse w-60 h-32 bg-gray-200 rounded mb-4"></div>
      <div className="w-1/3 h-10 bg-gray-200 rounded mb-2"></div>
      <div className="w-1/2 h-8 bg-gray-100 rounded mb-6"></div>
      <div className="w-[90%] h-48 bg-gray-100 rounded"></div>
    </div>
  );
};
