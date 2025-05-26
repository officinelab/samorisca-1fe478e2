import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { uploadImageToStorage, deleteImageFromStorage } from './uploadUtils';
import ImagePreview from './ImagePreview';
import UploadPlaceholder from './UploadPlaceholder';

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
  const previousImage = useRef<string | null>(null);
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert MB to bytes
  
  console.log("ImageUploader props:", { bucketName, folderPath, currentImage });
  
  // Carica l'immagine corrente all'inizializzazione del componente
  useEffect(() => {
    if (currentImage) {
      setImageUrl(currentImage);
      setImageError(false);
    } else {
      setImageUrl(null);
    }
    // Ricordati il vecchio url per la cancellazione su upload nuovo
    previousImage.current = currentImage;
  }, [currentImage]);
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log("Starting image upload for file:", file.name, "to bucket:", bucketName);
    
    setIsUploading(true);
    setImageError(false);
    
    // Create local preview
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
    
    // Carica la nuova immagine
    const uploadResult = await uploadImageToStorage(file, {
      bucketName,
      folderPath,
      maxSizeInBytes,
      allowedTypes
    });
    
    if (uploadResult) {
      console.log("Upload successful:", uploadResult);
      setImageUrl(uploadResult);
      onImageUploaded(uploadResult);
      toast.success("Immagine caricata con successo!");
      // Cancella la precedente solo se diversa e su menu-images
      if (
        previousImage.current &&
        previousImage.current !== uploadResult &&
        previousImage.current.includes("menu-images/")
      ) {
        await deleteImageFromStorage(previousImage.current, bucketName);
      }
      previousImage.current = uploadResult;
    } else {
      console.error("Upload failed");
      setImageError(true);
      setImageUrl(null);
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
            className="absolute top-2 right-2 w-5 h-5"
            onClick={handleRemoveImage}
            disabled={isUploading}
            tabIndex={0}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
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
              label=""
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
