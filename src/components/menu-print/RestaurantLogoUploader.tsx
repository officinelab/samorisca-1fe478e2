
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

interface RestaurantLogoUploaderProps {
  currentLogo: string | null;
  onLogoUploaded: (logoUrl: string | null) => void;
  title?: string;
  description?: string;
  defaultPreview?: string;
  uploadPath?: string;
}

const RestaurantLogoUploader: React.FC<RestaurantLogoUploaderProps> = ({
  currentLogo,
  onLogoUploaded,
  title = "Logo del Ristorante",
  description = "Carica il logo del tuo ristorante",
  defaultPreview,
  uploadPath = "restaurant/logos"
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Per favore seleziona un file immagine valido');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Il file è troppo grande. Massimo 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uploadPath}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('menu-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(data.path);

      // Update logo
      await onLogoUploaded(publicUrl);
      toast.success('Logo caricato con successo!');

    } catch (error) {
      console.error('Errore durante il caricamento:', error);
      toast.error('Errore durante il caricamento del logo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    try {
      await onLogoUploaded(null);
      toast.success('Logo rimosso con successo!');
    } catch (error) {
      console.error('Errore durante la rimozione:', error);
      toast.error('Errore durante la rimozione del logo');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">{title}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Logo Preview */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {currentLogo ? (
          <div className="space-y-4">
            <img 
              src={currentLogo} 
              alt="Logo preview" 
              className="max-w-32 max-h-32 mx-auto object-contain rounded"
            />
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById(`logo-upload-${uploadPath}`)?.click()}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Sostituisci
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveLogo}
                disabled={isUploading}
              >
                <X className="w-4 h-4 mr-2" />
                Rimuovi
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {defaultPreview ? (
              <img 
                src={defaultPreview} 
                alt="Preview placeholder" 
                className="max-w-32 max-h-32 mx-auto object-contain rounded opacity-50"
              />
            ) : (
              <div className="w-32 h-32 mx-auto bg-gray-100 rounded flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => document.getElementById(`logo-upload-${uploadPath}`)?.click()}
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Caricamento...' : 'Carica Logo'}
            </Button>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        id={`logo-upload-${uploadPath}`}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default RestaurantLogoUploader;
