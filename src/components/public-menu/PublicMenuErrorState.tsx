
import React from 'react';

interface PublicMenuErrorStateProps {
  error: string;
  onRetry: () => void;
  errorLoadingMessage: string;
  retryMessage: string;
}

export const PublicMenuErrorState: React.FC<PublicMenuErrorStateProps> = ({
  error,
  onRetry,
  errorLoadingMessage,
  retryMessage
}) => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-50">
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{errorLoadingMessage}</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {retryMessage}
        </button>
      </div>
    </div>
  );
};
