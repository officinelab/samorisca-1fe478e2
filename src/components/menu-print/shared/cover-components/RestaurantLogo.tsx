
import React, { useState } from 'react';
import { PrintLayout } from '@/types/printLayout';

interface RestaurantLogoProps {
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
}

export const RestaurantLogo: React.FC<RestaurantLogoProps> = ({ 
  restaurantLogo, 
  customLayout 
}) => {
  const [imageError, setImageError] = useState(false);
  
  const getLogoStyle = () => {
    if (customLayout?.cover?.logo) {
      const { maxWidth, maxHeight } = customLayout.cover.logo;
      return {
        maxWidth: `${maxWidth}%`,
        maxHeight: `${maxHeight}%`,
        objectFit: 'contain' as const,
      };
    }
    
    // Default style
    return {
      maxWidth: '80%',
      maxHeight: '50%',
      objectFit: 'contain' as const,
    };
  };
  
  const getLogoContainerStyle = () => {
    return {
      width: '100%',
      display: 'flex',
      justifyContent: customLayout?.cover?.logo?.alignment || 'center',
      marginTop: customLayout?.cover?.logo?.marginTop ? `${customLayout.cover.logo.marginTop}mm` : '0',
      marginBottom: customLayout?.cover?.logo?.marginBottom ? `${customLayout.cover.logo.marginBottom}mm` : '0',
    };
  };

  const handleImageError = () => {
    console.error("Errore nel caricamento del logo del ristorante in CoverPage");
    setImageError(true);
  };

  if (!restaurantLogo || imageError) {
    return null;
  }
  
  return (
    <div style={getLogoContainerStyle()}>
      <img 
        src={restaurantLogo}
        alt="Logo del ristorante"
        style={getLogoStyle()}
        onError={handleImageError}
      />
    </div>
  );
};
