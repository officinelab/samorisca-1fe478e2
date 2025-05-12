
import React, { useState } from 'react';
import { PrintLayout } from '@/types/printLayout';

interface CoverLogoProps {
  restaurantLogo: string | null;
  customLayout?: PrintLayout | null;
}

export const CoverLogo: React.FC<CoverLogoProps> = ({ restaurantLogo, customLayout }) => {
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
    if (customLayout?.cover?.logo) {
      const { alignment, marginTop, marginBottom } = customLayout.cover.logo;
      
      return {
        width: '100%',
        display: 'flex',
        justifyContent: alignment === 'left' ? 'flex-start' : 
                       alignment === 'right' ? 'flex-end' : 
                       'center',
        marginTop: marginTop ? `${marginTop}mm` : '0',
        marginBottom: marginBottom ? `${marginBottom}mm` : '0',
      };
    }
    
    return {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginTop: '0',
      marginBottom: '0',
    };
  };

  const handleImageError = () => {
    console.error("Errore nel caricamento del logo del ristorante in CoverLogo");
    setImageError(true);
  };

  // Controlla se il logo esiste e non ha errori
  const hasValidLogo = restaurantLogo && !imageError && restaurantLogo.trim() !== '';
  
  if (!hasValidLogo) return null;

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
