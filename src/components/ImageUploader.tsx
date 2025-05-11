
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Upload, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from '@/integrations/supabase/client';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string | null;
  label?: string;
  bucketName?: string;
  folderPath?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
  id?: string;
  defaultPreview?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  currentImage = null,
  label = "Carica immagine",
  bucketName = "menu-images",
  folderPath = "uploads",
  maxSizeInMB = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  id = "imageUpload",
  defaultPreview = "/placeholder.svg"
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert MB to bytes
  
  // Carica l'immagine corrente all'inizializzazione del componente
  useEffect(() => {
    if (currentImage) {
      setImageUrl(currentImage);
      setImageError(false);
    } else {
      setImageUrl(null);
    }
  }, [currentImage]);
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast.error(`Tipo di file non supportato. Tipi supportati: ${allowedTypes.join(', ')}`);
      return;
    }
    
    // Validate file size
    if (file.size > maxSizeInBytes) {
      toast.error(`Il file è troppo grande. Dimensione massima: ${maxSizeInMB}MB`);
      return;
    }
    
    setIsUploading(true);
    setImageError(false);
    
    try {
      console.log(`Uploading to bucket: ${bucketName}, folder: ${folderPath}`);
      
      // Create local preview
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
      
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
      
      setImageUrl(urlData.publicUrl);
      onImageUploaded(urlData.publicUrl);
      toast.success("Immagine caricata con successo!");
    } catch (error) {
      console.error("Errore durante il caricamento dell'immagine:", error);
      toast.error("Errore durante il caricamento dell'immagine. Riprova più tardi.");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveImage = () => {
    setImageUrl(null);
    setImageError(false);
    onImageUploaded('');
    toast.success("Immagine rimossa con successo");
  };

  const handleImageError = () => {
    console.error("Error loading preview image");
    setImageError(true);
  };
  
  return (
    <Card className="p-4 relative overflow-hidden">
      {(imageUrl && !imageError) ? (
        <div className="relative">
          <img 
            src={imageUrl} 
            alt="Uploaded" 
            className="w-full h-auto max-h-48 object-contain rounded-md" 
            onError={handleImageError}
          />
          {isUploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 w-8 h-8"
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="text-center mb-2">{label}</div>
          <input
            type="file"
            id={id}
            className="hidden"
            accept={allowedTypes.join(',')}
            onChange={handleImageChange}
            disabled={isUploading}
          />
          <label 
            htmlFor={id}
            className="cursor-pointer w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <span>Caricamento in corso...</span>
              </div>
            ) : imageError ? (
              <div className="flex flex-col items-center justify-center">
                <img 
                  src={defaultPreview} 
                  alt="Default" 
                  className="h-12 w-auto mb-2" 
                />
                <span className="text-sm text-gray-500">Errore di caricamento. Clicca per selezionare un'immagine</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                {currentImage ? (
                  <img 
                    src={currentImage} 
                    alt="Current" 
                    className="h-12 w-auto mb-2 object-contain" 
                    onError={handleImageError}
                  />
                ) : (
                  <img 
                    src={defaultPreview} 
                    alt="Default" 
                    className="h-12 w-auto mb-2" 
                  />
                )}
                <span className="text-sm text-gray-500">Clicca per selezionare un'immagine</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, GIF</span>
              </div>
            )}
          </label>
        </div>
      )}
    </Card>
  );
};

export default ImageUploader;
