
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageIcon, X } from "lucide-react";

interface ImageUploaderProps {
  path: string;
  url: string | null;
  onUpload: (url: string) => void;
}

const ImageUploader = ({ path, url, onUpload }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Valida il tipo di file
    if (!file.type.startsWith('image/')) {
      toast.error("Per favore seleziona un file immagine valido");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Carica l'immagine su Supabase Storage
      const filePath = `${path}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Ottieni l'URL pubblico dell'immagine
      const { data: publicUrlData } = supabase.storage
        .from('menu-images')
        .getPublicUrl(data.path);
      
      onUpload(publicUrlData.publicUrl);
      toast.success("Immagine caricata con successo");
    } catch (error) {
      console.error('Errore nel caricamento dell\'immagine:', error);
      toast.error("Errore nel caricamento dell'immagine. Riprova più tardi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onUpload('');
  };

  return (
    <div className="space-y-4">
      {url ? (
        <div className="space-y-2">
          <div className="relative w-32 h-32 mx-auto border rounded-md p-2 bg-gray-50">
            <img 
              src={url} 
              alt="Image Preview" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={isUploading}
            >
              <ImageIcon className="h-4 w-4 mr-2" /> 
              Cambia Immagine
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              <X className="h-4 w-4 mr-2" />
              Rimuovi Immagine
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Label 
            htmlFor="image-upload" 
            className="cursor-pointer border border-dashed border-gray-300 rounded-md p-8 w-full text-center hover:bg-gray-50"
          >
            {isUploading ? "Caricamento in corso..." : "Carica un'immagine"}
          </Label>
        </div>
      )}
      <input 
        id="image-upload" 
        type="file" 
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default ImageUploader;
