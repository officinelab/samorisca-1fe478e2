
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { FileImage, X } from "lucide-react";

interface SVGIconUploaderProps {
  currentIcon?: string | null;
  onIconUploaded: (url: string) => void;
}

export const SVGIconUploader = ({ currentIcon, onIconUploaded }: SVGIconUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentIcon || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Valida il tipo di file (accetta solo SVG)
    if (file.type !== 'image/svg+xml') {
      toast.error("Per favore seleziona un file SVG valido");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Crea un'anteprima locale
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Carica l'immagine su Supabase Storage
      const filePath = `site-icons/${Date.now()}-${file.name}`;
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
      toast.success("Icona SVG caricata con successo");
    } catch (error) {
      console.error('Errore nel caricamento dell\'icona SVG:', error);
      toast.error("Errore nel caricamento dell'icona SVG. Riprova più tardi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveIcon = () => {
    setPreviewUrl(null);
    onIconUploaded('');
  };

  return (
    <div className="space-y-4">
      <Label>Icona del Sito (SVG)</Label>
      {previewUrl ? (
        <div className="space-y-2">
          <div className="relative w-32 h-32 mx-auto border rounded-md p-2 bg-gray-50">
            <img 
              src={previewUrl} 
              alt="SVG Icon Preview" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => document.getElementById('svg-icon-upload')?.click()}
              disabled={isUploading}
            >
              <FileImage className="h-4 w-4 mr-2" /> 
              Cambia Icona
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleRemoveIcon}
              disabled={isUploading}
            >
              <X className="h-4 w-4 mr-2" />
              Rimuovi Icona
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Label 
            htmlFor="svg-icon-upload" 
            className="cursor-pointer border border-dashed border-gray-300 rounded-md p-8 w-full text-center hover:bg-gray-50"
          >
            {isUploading ? "Caricamento in corso..." : "Carica un'icona SVG"}
          </Label>
        </div>
      )}
      <Input 
        id="svg-icon-upload" 
        type="file" 
        accept=".svg,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default SVGIconUploader;
