import { toast } from "@/components/ui/sonner";
import { supabase } from '@/integrations/supabase/client';

export interface UploadOptions {
  bucketName: string;
  folderPath: string;
  maxSizeInBytes: number;
  allowedTypes: string[];
}

export const uploadImageToStorage = async (
  file: File, 
  options: UploadOptions
): Promise<string | null> => {
  const { bucketName, folderPath, maxSizeInBytes, allowedTypes } = options;

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    toast.error(`Tipo di file non supportato. Tipi supportati: ${allowedTypes.join(', ')}`);
    return null;
  }
  
  // Validate file size
  if (file.size > maxSizeInBytes) {
    toast.error(`Il file è troppo grande. Dimensione massima: ${maxSizeInBytes / (1024 * 1024)}MB`);
    return null;
  }
  
  try {
    console.log(`Uploading to bucket: ${bucketName}, folder: ${folderPath}`);
    
    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${folderPath}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error("Upload error:", error);
      throw error;
    }
    
    console.log("Upload successful:", data);
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    console.log("Public URL:", urlData.publicUrl);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error("Errore durante il caricamento dell'immagine:", error);
    toast.error("Errore durante il caricamento dell'immagine. Riprova più tardi.");
    return null;
  }
};

// Helper per eliminare una immagine dal bucket (dato un publicUrl Supabase)
export const deleteImageFromStorage = async (publicUrl: string, bucketName = 'menu-images') => {
  if (!publicUrl) return;
  try {
    // Trova il percorso relativo a partire dalla pubblica URL
    const match = publicUrl.match(/menu-images\/(.+)$/);
    if (!match) return;

    const filePath = match[1];
    const { error } = await supabase.storage.from(bucketName).remove([filePath]);
    if (error) {
      console.warn("Non sono riuscito a cancellare la vecchia immagine:", error);
      toast.warning("Attenzione: la vecchia immagine non è stata rimossa.");
    } else {
      console.log("Vecchia immagine rimossa correttamente", filePath);
    }
  } catch (e) {
    console.error("Errore rimozione immagine:", e);
  }
};
