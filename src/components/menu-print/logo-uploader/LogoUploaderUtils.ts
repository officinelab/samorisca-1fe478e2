
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export const uploadLogoToStorage = async (
  file: File,
  uploadPath: string
): Promise<string | null> => {
  try {
    console.log(`Uploading logo to Supabase Storage at path: ${uploadPath}`);
    
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
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Errore nel caricamento del logo:', error);
    toast.error("Errore nel caricamento del logo. Riprova più tardi.");
    return null;
  }
};

export const validateImageFile = (file: File): boolean => {
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
