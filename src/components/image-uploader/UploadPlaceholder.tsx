
import React from "react";
import { Loader2, Upload } from "lucide-react";

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
        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
        <span className="text-sm text-gray-500">Errore di caricamento</span>
      </div>
    );
  }

  // Mostra solo icona upload se non c'è alcuna immagine caricata
  if (!currentImage) {
    return (
      <div className="flex flex-col items-center justify-center pt-2">
        <Upload className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <img 
        src={currentImage} 
        alt="Current" 
        className="h-12 w-auto mb-2 object-contain" 
        onError={onError}
      />
    </div>
  );
};

export default UploadPlaceholder;
