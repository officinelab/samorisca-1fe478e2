import React, { useState } from 'react';
import { PrintLayout } from '@/types/printLayout';
import { getLogoStyle, getLogoContainerStyle } from './coverStyleUtils';
import { getCoverLogoUrl } from './getCoverLogoUrl';

interface CoverLogoProps {
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
}

const CoverLogo: React.FC<CoverLogoProps> = ({ restaurantLogo, customLayout }) => {
  const [imageError, setImageError] = useState(false);

  // Logo sempre visibile
  const logoUrl = getCoverLogoUrl(!imageError ? restaurantLogo : undefined);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div style={getLogoContainerStyle(customLayout)}>
      <img
        src={logoUrl}
        alt="Logo del ristorante"
        style={getLogoStyle(customLayout)}
        onError={handleImageError}
      />
    </div>
  );
};

export default CoverLogo;
