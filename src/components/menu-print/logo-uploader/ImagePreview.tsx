
import React from "react";
import { Loader2 } from "lucide-react";

interface ImagePreviewProps {
  previewUrl: string | null;
  isUploading: boolean;
  onError: () => void;
  defaultPreview: string;
  altText: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  previewUrl,
  isUploading,
  onError,
  defaultPreview,
  altText
}) => {
  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <span>Caricamento in corso...</span>
      </div>
    );
  }

  if (!previewUrl) {
    return (
      <div className="flex flex-col items-center justify-center">
        <img 
          src={defaultPreview} 
          alt="Default Logo" 
          className="max-w-full max-h-24 object-contain mb-2" 
        />
        <span className="text-gray-500">Clicca per caricare il logo</span>
        <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, GIF</span>
      </div>
    );
  }

  return (
    <img 
      src={previewUrl} 
      alt={altText} 
      className="max-w-full max-h-24 object-contain mb-2" 
      onError={onError}
    />
  );
};

export default ImagePreview;
