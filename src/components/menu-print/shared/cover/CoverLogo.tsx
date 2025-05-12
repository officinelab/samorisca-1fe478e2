
import React, { useState } from 'react';
import { PrintLayout } from '@/types/printLayout';
import { getLogoStyle, getLogoContainerStyle } from './coverStyleUtils';

interface CoverLogoProps {
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
}

const CoverLogo: React.FC<CoverLogoProps> = ({ restaurantLogo, customLayout }) => {
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

  return (
    <div style={getLogoContainerStyle(customLayout)}>
      <img
        src={restaurantLogo}
        alt="Logo del ristorante"
        style={getLogoStyle(customLayout)}
        onError={handleImageError}
      />
    </div>
  );
};

export default CoverLogo;
