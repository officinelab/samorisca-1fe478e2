
import React from 'react';
import { Allergen } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import PageContainer from '../allergens/PageContainer';
import AllergenHeader from '../allergens/AllergenHeader';
import AllergensList from '../allergens/AllergensList';

export interface AllergensPageProps {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  allergens: Allergen[];
  layoutType?: 'classic' | 'modern' | 'allergens' | 'custom';
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
  safetyMargin?: {
    vertical: number;
    horizontal: number;
  };
}

const AllergensPage: React.FC<AllergensPageProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  allergens,
  layoutType = 'classic',
  restaurantLogo,
  customLayout,
  safetyMargin = { vertical: 8, horizontal: 3 }
}) => {
  return (
    <PageContainer
      A4_WIDTH_MM={A4_WIDTH_MM}
      A4_HEIGHT_MM={A4_HEIGHT_MM}
      showPageBoundaries={showPageBoundaries}
      layoutType={layoutType}
      safetyMargin={safetyMargin}
    >
      <AllergenHeader 
        layoutType={layoutType} 
        restaurantLogo={restaurantLogo} 
      />
      <AllergensList 
        allergens={allergens} 
        layoutType={layoutType} 
      />
    </PageContainer>
  );
};

export default AllergensPage;
