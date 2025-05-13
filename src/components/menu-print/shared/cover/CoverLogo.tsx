
import React, { useState } from 'react';
import { PrintLayout } from '@/types/printLayout';

export interface CoverLogoProps {
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
}

const CoverLogo: React.FC<CoverLogoProps> = ({ 
  restaurantLogo, 
  customLayout 
}) => {
  const [imageError, setImageError] = useState(false);

  // Check if the logo is visible - default to true if not defined
  const isLogoVisible = customLayout?.cover?.logo?.visible !== false;

  const handleImageError = () => {
    console.error("Error loading restaurant logo in CoverLogo");
    setImageError(true);
  };

  if (!restaurantLogo || imageError || !isLogoVisible) {
    return null;
  }

  // Get logo style from custom layout or use defaults
  const containerStyle = {
    textAlign: customLayout?.cover?.logo?.alignment || 'center',
    maxWidth: '100%',
    marginTop: `${customLayout?.cover?.logo?.marginTop || 0}mm`,
    marginBottom: `${customLayout?.cover?.logo?.marginBottom || 20}mm`,
  } as React.CSSProperties;

  const logoStyle = {
    maxWidth: `${customLayout?.cover?.logo?.maxWidth || 70}%`,
    maxHeight: `${customLayout?.cover?.logo?.maxHeight || 40}%`,
    objectFit: 'contain' as 'contain',
  };

  return (
    <div style={containerStyle}>
      <img
        src={restaurantLogo}
        alt="Logo del ristorante"
        style={logoStyle}
        onError={handleImageError}
      />
    </div>
  );
};

export default CoverLogo;
