
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

interface IconUploaderProps {
  currentIcon?: string | null;
  onIconUploaded: (url: string) => void;
}

export const IconUploader = ({ currentIcon, onIconUploaded }: IconUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentIcon || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Valida il tipo di file
    if (!file.type.startsWith('image/')) {
      toast.error("Per favore seleziona un'immagine valida");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Crea un'anteprima locale
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Carica l'immagine su Supabase Storage
      const filePath = `allergens/${Date.now()}-${file.name}`;
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
      
      onIconUploaded(publicUrlData.publicUrl);
    } catch (error) {
      console.error('Errore nel caricamento dell\'icona:', error);
      toast.error("Errore nel caricamento dell'icona. Riprova più tardi.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Icona Allergene</Label>
      {previewUrl && (
        <div className="relative w-20 h-20 mb-2">
          <img 
            src={previewUrl} 
            alt="Icon Preview" 
            className="w-full h-full object-contain rounded-md"
          />
        </div>
      )}
      <div className="flex items-center">
        <Label 
          htmlFor="icon-upload" 
          className="cursor-pointer border border-dashed border-gray-300 rounded-md px-4 py-2 w-full text-center hover:bg-gray-50"
        >
          {isUploading ? "Caricamento in corso..." : "Carica icona"}
        </Label>
        <Input 
          id="icon-upload" 
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  );
};
