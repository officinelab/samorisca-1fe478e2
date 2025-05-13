
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { uploadImageToStorage } from './uploadUtils';
import ImagePreview from './ImagePreview';
import UploadPlaceholder from './UploadPlaceholder';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string | null;
  label?: string;
  description?: string; // Added description prop
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
  description, // Added description prop
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
    
    setIsUploading(true);
    setImageError(false);
    
    // Create local preview
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
    
    const uploadResult = await uploadImageToStorage(file, {
      bucketName,
      folderPath,
      maxSizeInBytes,
      allowedTypes
    });
    
    if (uploadResult) {
      setImageUrl(uploadResult);
      onImageUploaded(uploadResult);
      toast.success("Immagine caricata con successo!");
    }
    
    setIsUploading(false);
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
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
      
      {(imageUrl && !imageError) ? (
        <div className="relative">
          <ImagePreview 
            imageUrl={imageUrl}
            isUploading={isUploading}
            onError={handleImageError}
            defaultPreview={defaultPreview}
            currentImage={currentImage}
          />
          
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
            <UploadPlaceholder 
              isUploading={isUploading}
              label="Clicca per selezionare un'immagine"
              defaultPreview={defaultPreview}
              currentImage={currentImage}
              hasError={imageError}
              onError={handleImageError}
            />
          </label>
        </div>
      )}
    </Card>
  );
};

export default ImageUploader;
