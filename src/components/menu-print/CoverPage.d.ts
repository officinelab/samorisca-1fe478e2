
import React from 'react';

export interface CoverPageProps {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  layoutType: 'classic' | 'modern' | 'allergens' | 'custom';
  restaurantLogo?: string | null;
}

declare const CoverPage: React.FC<CoverPageProps>;
export default CoverPage;
