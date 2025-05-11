
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

interface RestaurantLogoUploaderProps {
  currentLogo?: string | null;
  onLogoUploaded: (url: string) => void;
  title?: string;
  description?: string;
}

export const RestaurantLogoUploader = ({ 
  currentLogo, 
  onLogoUploaded,
  title = "Logo del Ristorante", 
  description
}: RestaurantLogoUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogo || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Per favore seleziona un'immagine valida");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create local preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Upload image to Supabase Storage
      const filePath = `restaurant/logo-${Date.now()}.${file.name.split('.').pop()}`;
      const { data, error } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      // Get public URL of the image
      const { data: publicUrlData } = supabase.storage
        .from('menu-images')
        .getPublicUrl(data.path);
      
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
    onLogoUploaded('');
  };

  return (
    <div className="space-y-4">
      <Label>{title}</Label>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {previewUrl ? (
        <div className="space-y-2">
          <div className="relative w-40 h-40 mx-auto">
            <img 
              src={previewUrl} 
              alt="Logo Preview" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex justify-center gap-2">
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
          <Label 
            htmlFor="logo-upload" 
            className="cursor-pointer border border-dashed border-gray-300 rounded-md p-10 w-full text-center hover:bg-gray-50"
          >
            {isUploading ? "Caricamento in corso..." : "Carica il logo del ristorante"}
          </Label>
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
