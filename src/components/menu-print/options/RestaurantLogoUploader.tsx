
import React from "react";
import { RestaurantLogoUploader as BaseRestaurantLogoUploader } from "@/components/menu-print/RestaurantLogoUploader";

interface RestaurantLogoUploaderProps {
  restaurantLogo: string | null;
  updateRestaurantLogo: (logoUrl: string) => void;
}

const RestaurantLogoUploader: React.FC<RestaurantLogoUploaderProps> = ({ 
  restaurantLogo, 
  updateRestaurantLogo 
}) => {
  return (
    <BaseRestaurantLogoUploader
      currentLogo={restaurantLogo}
      onLogoUploaded={updateRestaurantLogo}
      title="Logo del Ristorante"
      description={
        <p className="text-muted-foreground text-sm mb-2">
          Carica il logo del tuo ristorante che apparirà nella stampa del menu
        </p>
      }
    />
  );
};

export default RestaurantLogoUploader;
