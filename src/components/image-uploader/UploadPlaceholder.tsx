
import React from "react";
import { Loader2 } from "lucide-react";

interface UploadPlaceholderProps {
  isUploading: boolean;
  label: string;
  defaultPreview: string;
  currentImage?: string | null;
  hasError: boolean;
  onError?: () => void;
}

export const UploadPlaceholder: React.FC<UploadPlaceholderProps> = ({
  isUploading,
  label,
  defaultPreview,
  currentImage,
  hasError,
  onError
}) => {
  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <span>Caricamento in corso...</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center">
        <img 
          src={defaultPreview} 
          alt="Default" 
          className="h-12 w-auto mb-2" 
        />
        <span className="text-sm text-gray-500">Errore di caricamento. Clicca per selezionare un'immagine</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {currentImage ? (
        <img 
          src={currentImage} 
          alt="Current" 
          className="h-12 w-auto mb-2 object-contain" 
          onError={onError}
        />
      ) : (
        <img 
          src={defaultPreview} 
          alt="Default" 
          className="h-12 w-auto mb-2" 
        />
      )}
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, GIF</span>
    </div>
  );
};

export default UploadPlaceholder;
