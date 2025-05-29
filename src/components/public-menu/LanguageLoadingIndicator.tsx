
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LanguageLoadingIndicatorProps {
  isVisible: boolean;
  isLanguageChange: boolean;
  targetLanguage?: string;
}

export const LanguageLoadingIndicator: React.FC<LanguageLoadingIndicatorProps> = ({
  isVisible,
  isLanguageChange,
  targetLanguage
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 flex items-center gap-2 animate-in slide-in-from-right duration-300">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span className="text-sm text-gray-700">
        {isLanguageChange 
          ? `Caricamento ${targetLanguage?.toUpperCase()}...`
          : 'Caricamento menu...'
        }
      </span>
    </div>
  );
};
