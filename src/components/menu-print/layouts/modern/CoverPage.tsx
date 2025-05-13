
import React from 'react';
import SharedCoverPage from '../../shared/CoverPage';

interface CoverPageProps {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  restaurantLogo?: string | null;
}

const CoverPage: React.FC<CoverPageProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  restaurantLogo
}) => {
  return (
    <SharedCoverPage
      A4_WIDTH_MM={A4_WIDTH_MM}
      A4_HEIGHT_MM={A4_HEIGHT_MM}
      showPageBoundaries={showPageBoundaries}
      layoutType="modern"
      restaurantLogo={restaurantLogo}
    />
  );
};

export default CoverPage;
