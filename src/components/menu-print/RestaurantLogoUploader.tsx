
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Per favore seleziona un'immagine valida");
      return;
    }
    
    setIsUploading(true);
    setImageError(false);
    
    try {
      console.log(`Uploading logo to Supabase Storage at path: ${uploadPath}`);
      
      // Create local preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Upload image to Supabase Storage with a specific path for each logo type
      const filePath = `${uploadPath}-${Date.now()}.${file.name.split('.').pop()}`;
      const { data, error } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error("Logo upload error:", error);
        throw error;
      }
      
      console.log("Logo upload successful:", data);
      
      // Get public URL of the image
      const { data: publicUrlData } = supabase.storage
        .from('menu-images')
        .getPublicUrl(data.path);
      
      console.log("Logo public URL:", publicUrlData.publicUrl);
      
      onLogoUploaded(publicUrlData.publicUrl);
      toast.success("Logo caricato con successo");
    } catch (error) {
      console.error('Errore nel caricamento del logo:', error);
      toast.error("Errore nel caricamento del logo. Riprova più tardi.");
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
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => document.getElementById('logo-upload')?.click()}
              disabled={isUploading}
            >
              Cambia Logo
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleRemoveLogo}
              disabled={isUploading}
            >
              Rimuovi Logo
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div 
            className="cursor-pointer border border-dashed border-gray-300 rounded-md p-10 w-full text-center hover:bg-gray-50"
            onClick={() => document.getElementById('logo-upload')?.click()}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <span>Caricamento in corso...</span>
              </div>
            ) : imageError ? (
              <div className="flex flex-col items-center justify-center">
                <img 
                  src={defaultPreview} 
                  alt="Fallback Logo" 
                  className="max-w-full max-h-24 object-contain mb-2" 
                />
                <span className="text-gray-500">Errore di caricamento. Clicca per caricare nuovo logo</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                {currentLogo ? (
                  <img 
                    src={currentLogo} 
                    alt="Logo Preview" 
                    className="max-w-full max-h-24 object-contain mb-2" 
                    onError={handleImageError}
                  />
                ) : (
                  <img 
                    src={defaultPreview} 
                    alt="Default Logo" 
                    className="max-w-full max-h-24 object-contain mb-2" 
                  />
                )}
                <span className="text-gray-500">Clicca per caricare il logo</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, GIF</span>
              </div>
            )}
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
