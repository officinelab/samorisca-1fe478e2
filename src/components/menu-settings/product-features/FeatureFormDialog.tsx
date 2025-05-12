
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { ProductFeature } from "@/types/database";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FeatureFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (feature: Partial<ProductFeature>) => Promise<void>;
  feature: Partial<ProductFeature>;
  isEditing: boolean;
}

export const FeatureFormDialog: React.FC<FeatureFormDialogProps> = ({
  open,
  onClose,
  onSave,
  feature,
  isEditing
}) => {
  const [currentFeature, setCurrentFeature] = useState<Partial<ProductFeature>>(feature);

  useEffect(() => {
    setCurrentFeature(feature);
  }, [feature]);

  const handleImageUploaded = (url: string) => {
    setCurrentFeature(prev => ({ ...prev, icon_url: url }));
  };

  const handleSubmit = async () => {
    if (!currentFeature.title) return;
    await onSave(currentFeature);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifica Caratteristica" : "Nuova Caratteristica"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifica i dettagli della caratteristica selezionata." 
              : "Inserisci i dettagli per la nuova caratteristica."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Titolo *
            </label>
            <Input
              id="title"
              value={currentFeature.title || ''}
              onChange={(e) => setCurrentFeature({...currentFeature, title: e.target.value})}
              placeholder="Nome della caratteristica"
            />
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Icona (opzionale)
            </label>
            <ImageUploader
              onImageUploaded={handleImageUploaded}
              currentImage={currentFeature.icon_url}
              label="Carica icona"
              bucketName="menu-images"
              folderPath="features-icons"
              maxSizeInMB={2}
              allowedTypes={["image/jpeg", "image/png", "image/webp", "image/svg+xml"]}
              id={`feature-icon-upload-${currentFeature.id || 'new'}`}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            <X size={16} className="mr-2" /> Annulla
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!currentFeature.title}
          >
            <Check size={16} className="mr-2" /> 
            {isEditing ? "Aggiorna" : "Salva"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureFormDialog;
