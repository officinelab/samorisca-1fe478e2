
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
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
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  currentImage = null,
  label = "Carica immagine",
  bucketName = "images",
  folderPath = "uploads",
  maxSizeInMB = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  id = "imageUpload"
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(currentImage);
  const [isUploading, setIsUploading] = useState(false);
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert MB to bytes
  
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
    
    try {
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
        throw error;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      
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
    onImageUploaded('');
  };
  
  return (
    <Card className="p-4 relative">
      {imageUrl ? (
        <div className="relative">
          <img 
            src={imageUrl} 
            alt="Uploaded" 
            className="w-full h-auto max-h-48 object-contain rounded-md" 
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 w-8 h-8"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="text-center">{label}</div>
          <input
            type="file"
            id={id}
            className="hidden"
            accept={allowedTypes.join(',')}
            onChange={handleImageChange}
            disabled={isUploading}
          />
          <label htmlFor={id}>
            <Button 
              type="button" 
              variant="secondary" 
              disabled={isUploading} 
              className="cursor-pointer"
              asChild
            >
              <span>
                {isUploading ? "Caricamento in corso..." : "Seleziona immagine"}
              </span>
            </Button>
          </label>
        </div>
      )}
    </Card>
  );
};

export default ImageUploader;
