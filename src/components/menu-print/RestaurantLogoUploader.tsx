import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import ImagePreview from "./logo-uploader/ImagePreview";
import LogoActions from "./logo-uploader/LogoActions";
import { supabase } from "@/integrations/supabase/client";
import { deleteImageFromStorage } from "@/components/image-uploader/uploadUtils";

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
  const previousLogo = useRef<string | null>(null);

  // Carica l'immagine corrente all'avvio
  useEffect(() => {
    if (currentLogo) {
      setPreviewUrl(currentLogo);
      setImageError(false);
    } else {
      setPreviewUrl(null);
    }
    previousLogo.current = currentLogo;
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

      // Upload to Supabase storage
      const publicUrl = await uploadToSupabase(file, uploadPath);
      
      if (publicUrl) {
        onLogoUploaded(publicUrl);
        toast.success("Logo caricato con successo");
        // Cancella la precedente solo se diversa e su menu-images
        if (
          previousLogo.current &&
          previousLogo.current !== publicUrl &&
          previousLogo.current.includes("menu-images/")
        ) {
          await deleteImageFromStorage(previousLogo.current, "menu-images");
        }
        previousLogo.current = publicUrl;
      }
    } catch (error) {
      console.error("Errore nel caricamento:", error);
      toast.error("Si è verificato un errore nel caricamento del logo");
      setImageError(true);
    } finally {
      setIsUploading(false);
    }
  };

  const validateImageFile = (file: File): boolean => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Per favore seleziona un'immagine valida");
      return false;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("L'immagine è troppo grande. Dimensione massima: 5MB");
      return false;
    }
    
    return true;
  };

  const uploadToSupabase = async (file: File, path: string): Promise<string | null> => {
    try {
      // Upload image to Supabase Storage with a unique filename
      const filePath = `${path}/${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('menu-images')
        .getPublicUrl(data.path);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error('Errore nel caricamento a Supabase:', error);
      return null;
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
    // Generiamo un ID unico per evitare conflitti tra più uploader nella stessa pagina
    const inputId = `logo-upload-${uploadPath.replace(/\//g, '-')}`;
    document.getElementById(inputId)?.click();
  };

  const hasLogo = previewUrl !== null && !imageError;
  const inputId = `logo-upload-${uploadPath.replace(/\//g, '-')}`;

  return (
    <div className="space-y-4">
      {description}
      
      {previewUrl && !imageError ? (
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
        id={inputId} 
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
