
import React from "react";
import { Loader2 } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string | null;
  isUploading: boolean;
  onError: () => void;
  defaultPreview: string;
  currentImage?: string | null;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  isUploading,
  onError,
  defaultPreview,
  currentImage
}) => {
  if (isUploading) {
    return (
      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayImage = imageUrl || currentImage || defaultPreview;

  return (
    <img 
      src={displayImage} 
      alt="Preview" 
      className="w-full h-auto max-h-48 object-contain rounded-md" 
      onError={onError}
    />
  );
};

export default ImagePreview;
