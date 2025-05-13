
import React from 'react';
import { Allergen } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import AllergenHeader from './AllergenHeader';
import AllergensList from './AllergensList';
import PageContainer from './PageContainer';

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
  restaurantLogo,
  customLayout,
  safetyMargin = { vertical: 8, horizontal: 3 }
}) => {
  return (
    <PageContainer
      A4_WIDTH_MM={A4_WIDTH_MM}
      A4_HEIGHT_MM={A4_HEIGHT_MM}
      showPageBoundaries={showPageBoundaries}
      safetyMargin={safetyMargin}
    >
      <AllergenHeader 
        restaurantLogo={restaurantLogo} 
      />
      <AllergensList 
        allergens={allergens} 
      />
    </PageContainer>
  );
};

export default AllergensPage;
