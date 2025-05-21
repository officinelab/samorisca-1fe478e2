
import { useState } from "react";
import { uploadLogoToStorage } from "@/components/menu-print/logo-uploader/LogoUploaderUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

// Utility per estrarre filename dal publicUrl restituito
function getFilePathFromUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  // Esempio publicUrl: https://YOURPROJECT.supabase.co/storage/v1/object/public/menu-images/restaurant-cover-123456789.png
  const match = url.match(/menu-images\/(.+)$/);
  return match ? match[1] : null;
}

export function useCoverLogoUpload() {
  const [isUploading, setUploading] = useState(false);

  // upload nuova immagine e cancella la precedente se serve
  const uploadLogo = async (
    file: File,
    prevImageUrl: string | undefined | null
  ): Promise<string | null> => {
    setUploading(true);
    try {
      // 1. Carica immagine su Storage
      const publicUrl = await uploadLogoToStorage(file, "restaurant-cover");
      if (!publicUrl) {
        toast.error("Errore durante l'upload del logo.");
        setUploading(false);
        return null;
      }
      // 2. Elimina la precedente se c'è, è diversa e su bucket Supabase
      if (prevImageUrl && prevImageUrl !== publicUrl && prevImageUrl.includes("menu-images/")) {
        const filePath = getFilePathFromUrl(prevImageUrl);
        if (filePath) {
          const { error } = await supabase.storage
            .from("menu-images")
            .remove([filePath]);
          if (error) {
            // Mostra solo warning, anche se fallisce la cancellazione
            console.warn("Non sono riuscito a cancellare la vecchia immagine:", error);
            toast.warning("La vecchia immagine non è stata rimossa, puoi farlo manualmente dalle impostazioni Storage.");
          }
        }
      }
      setUploading(false);
      return publicUrl;
    } catch (err) {
      setUploading(false);
      toast.error("Errore durante l'upload del logo.");
      return null;
    }
  };

  return { uploadLogo, isUploading };
}

