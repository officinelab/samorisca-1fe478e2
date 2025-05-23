
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

  console.log("Starting upload with options:", options);
  console.log("File details:", { name: file.name, size: file.size, type: file.type });

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    const errorMsg = `Tipo di file non supportato. Tipi supportati: ${allowedTypes.join(', ')}`;
    console.error(errorMsg);
    toast.error(errorMsg);
    return null;
  }
  
  // Validate file size
  if (file.size > maxSizeInBytes) {
    const errorMsg = `Il file è troppo grande. Dimensione massima: ${maxSizeInBytes / (1024 * 1024)}MB`;
    console.error(errorMsg);
    toast.error(errorMsg);
    return null;
  }
  
  try {
    console.log(`Uploading to bucket: ${bucketName}, folder: ${folderPath}`);
    
    // Check if bucket exists first
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    console.log("Available buckets:", buckets?.map(b => b.name));
    
    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      console.error(`Bucket '${bucketName}' does not exist. Available buckets:`, buckets?.map(b => b.name));
      toast.error(`Errore: bucket '${bucketName}' non trovato. Controlla la configurazione.`);
      return null;
    }
    
    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${folderPath}/${fileName}`;
    
    console.log("Uploading file to path:", filePath);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error("Upload error details:", error);
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
    toast.error(`Errore durante il caricamento dell'immagine: ${error.message}`);
    return null;
  }
};

// Helper per eliminare una immagine dal bucket (dato un publicUrl Supabase)
export const deleteImageFromStorage = async (publicUrl: string, bucketName = 'menu-images') => {
  if (!publicUrl) return;
  try {
    console.log("Attempting to delete image:", publicUrl, "from bucket:", bucketName);
    // Trova il percorso relativo a partire dalla pubblica URL
    const match = publicUrl.match(/menu-images\/(.+)$/);
    if (!match) {
      console.warn("Could not extract file path from URL:", publicUrl);
      return;
    }

    const filePath = match[1];
    console.log("Deleting file at path:", filePath);
    
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
