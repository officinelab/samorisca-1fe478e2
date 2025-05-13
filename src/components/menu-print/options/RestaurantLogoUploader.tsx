
import React from "react";
import { ImageUploader } from "@/components/ImageUploader";

interface RestaurantLogoUploaderProps {
  restaurantLogo: string | null;
  updateRestaurantLogo: (logoUrl: string) => void;
}

const RestaurantLogoUploader: React.FC<RestaurantLogoUploaderProps> = ({ 
  restaurantLogo, 
  updateRestaurantLogo 
}) => {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Logo del Ristorante</h4>
      <ImageUploader
        currentImage={restaurantLogo}
        onImageUploaded={updateRestaurantLogo}
        label="Logo del Ristorante"
        description="Carica il logo del tuo ristorante che apparirà nella stampa del menu"
      />
    </div>
  );
};

export default RestaurantLogoUploader;
