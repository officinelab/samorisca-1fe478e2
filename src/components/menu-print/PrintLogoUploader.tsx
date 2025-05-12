
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import ImagePreview from "./logo-uploader/ImagePreview";
import LogoActions from "./logo-uploader/LogoActions";
import { uploadLogoToStorage, validateImageFile } from "./logo-uploader/LogoUploaderUtils";
import { usePrintLogoStorage } from "@/hooks/menu-print/usePrintLogoStorage";

interface PrintLogoUploaderProps {
  title?: string;
  description?: string;
  defaultPreview?: string;
  uploadPath?: string;
}

export const PrintLogoUploader = ({
  title = "Logo Stampa Menu",
  description,
  defaultPreview = "/placeholder.svg",
  uploadPath = "restaurant/print-logo"
}: PrintLogoUploaderProps) => {
  const { printLogo, updatePrintLogo, isLoading: isLoadingLogo } = usePrintLogoStorage();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Carica l'immagine corrente all'avvio
  useEffect(() => {
    if (printLogo) {
      setPreviewUrl(printLogo);
      setImageError(false);
    } else {
      setPreviewUrl(null);
    }
  }, [printLogo]);

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
        await updatePrintLogo(publicUrl);
        toast.success("Logo caricato con successo");
      }
    } catch (error) {
      console.error("Errore nel caricamento:", error);
      toast.error("Si è verificato un errore nel caricamento del logo");
      setImageError(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    try {
      await updatePrintLogo('');
      setPreviewUrl(null);
      setImageError(false);
      toast.success("Logo rimosso con successo");
    } catch (error) {
      console.error("Errore nella rimozione del logo:", error);
      toast.error("Si è verificato un errore nella rimozione del logo");
    }
  };

  const handleImageError = () => {
    console.error("Error loading logo preview image");
    setImageError(true);
  };

  const triggerFileInput = () => {
    // Generiamo un ID unico per evitare conflitti tra più uploader nella stessa pagina
    const inputId = `print-logo-upload-${uploadPath.replace(/\//g, '-')}`;
    document.getElementById(inputId)?.click();
  };

  const hasLogo = previewUrl !== null && !imageError;
  const inputId = `print-logo-upload-${uploadPath.replace(/\//g, '-')}`;
  
  if (isLoadingLogo) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Caricamento logo...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      
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

export default PrintLogoUploader;
