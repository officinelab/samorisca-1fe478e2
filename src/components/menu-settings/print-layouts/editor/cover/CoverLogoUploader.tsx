
import React, { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCoverLogoUpload } from "../hooks/useCoverLogoUpload";

interface CoverLogoUploaderProps {
  imageUrl: string;
  onUrlChange: (url: string) => void;
}

const CoverLogoUploader: React.FC<CoverLogoUploaderProps> = ({
  imageUrl,
  onUrlChange
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { uploadLogo, isUploading } = useCoverLogoUpload();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const publicUrl = await uploadLogo(file, imageUrl);
    setUploading(false);
    if (publicUrl) onUrlChange(publicUrl);
  };

  return (
    <div className="space-y-2">
      <Label>Logo copertina</Label>
      <div className="flex gap-2 items-center">
        <input
          ref={inputFileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => inputFileRef.current?.click()}
          className="bg-muted text-xs px-3 py-2 rounded border"
          disabled={isUploading || uploading}
        >
          {isUploading || uploading ? "Caricamento..." : "Carica immagine"}
        </button>
      </div>
      {imageUrl && (
        <div className="mt-2">
          <img src={imageUrl} alt="Anteprima logo copertina" className="max-w-[180px] max-h-[90px] border rounded shadow" />
        </div>
      )}
    </div>
  );
};

export default CoverLogoUploader;
