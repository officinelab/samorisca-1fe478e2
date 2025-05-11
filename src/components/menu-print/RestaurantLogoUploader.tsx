
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import ImagePreview from "./logo-uploader/ImagePreview";
import LogoActions from "./logo-uploader/LogoActions";
import { uploadLogoToStorage, validateImageFile } from "./logo-uploader/LogoUploaderUtils";

interface RestaurantLogoUploaderProps {
  currentLogo?: string | null;
  onLogoUploaded: (url: string) => void;
  title?: string;
  description?: string;
  defaultPreview?: string;
  uploadPath?: string;
}

export const RestaurantLogoUploader = ({ 
  currentLogo, 
  onLogoUploaded,
  title = "Logo del Ristorante", 
  description,
  defaultPreview = "/placeholder.svg",
  uploadPath = "restaurant/logo"
}: RestaurantLogoUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Carica l'immagine corrente all'avvio
  useEffect(() => {
    if (currentLogo) {
      setPreviewUrl(currentLogo);
      setImageError(false);
    } else {
      setPreviewUrl(null);
    }
  }, [currentLogo]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!validateImageFile(file)) {
      return;
    }
    
    setIsUploading(true);
    setImageError(false);
    
    try {
      // Create local preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Upload to storage
      const publicUrl = await uploadLogoToStorage(file, uploadPath);
      
      if (publicUrl) {
        onLogoUploaded(publicUrl);
        toast.success("Logo caricato con successo");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setPreviewUrl(null);
    setImageError(false);
    onLogoUploaded('');
    toast.success("Logo rimosso con successo");
  };

  const handleImageError = () => {
    console.error("Error loading logo preview image");
    setImageError(true);
  };

  const triggerFileInput = () => {
    document.getElementById('logo-upload')?.click();
  };

  const hasLogo = previewUrl !== null && !imageError;

  return (
    <div className="space-y-4">
      <Label>{title}</Label>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      
      {(previewUrl && !imageError) ? (
        <div className="space-y-4">
          <div className="relative w-40 h-40 bg-gray-100 rounded border flex items-center justify-center overflow-hidden">
            <img 
              src={previewUrl} 
              alt="Logo Preview" 
              className="max-w-full max-h-full object-contain"
              onError={handleImageError}
            />
            {isUploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>
          
          <LogoActions
            isUploading={isUploading}
            hasLogo={hasLogo}
            onRemove={handleRemoveLogo}
            triggerFileInput={triggerFileInput}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div 
            className="cursor-pointer border border-dashed border-gray-300 rounded-md p-10 w-full text-center hover:bg-gray-50"
            onClick={triggerFileInput}
          >
            <ImagePreview
              previewUrl={imageError ? null : previewUrl}
              isUploading={isUploading}
              onError={handleImageError}
              defaultPreview={defaultPreview}
              altText="Logo Preview"
            />
          </div>
        </div>
      )}
      <Input 
        id="logo-upload" 
        type="file" 
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default RestaurantLogoUploader;
