
import React from "react";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/ImageUploader";

interface CategoryNoteImageUploaderProps {
  currentIconUrl: string;
  onImageUploaded: (url: string) => void;
}

export const CategoryNoteImageUploader: React.FC<CategoryNoteImageUploaderProps> = ({
  currentIconUrl,
  onImageUploaded,
}) => {
  return (
    <div className="md:col-span-1">
      <Label>Icona</Label>
      <div className="max-w-[120px]">
        <ImageUploader
          onImageUploaded={onImageUploaded}
          currentImage={currentIconUrl}
          bucketName="category-note-icons"
          folderPath="icons"
          label="Carica icona"
          maxSizeInMB={2}
          allowedTypes={["image/jpeg", "image/png", "image/webp", "image/svg+xml"]}
          id="category-note-icon"
        />
      </div>
    </div>
  );
};
