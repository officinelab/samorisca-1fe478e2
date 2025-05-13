
import React from 'react';
import { Allergen } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import AllergenHeader from '../allergens/AllergenHeader';
import AllergensList from '../allergens/AllergensList';
import PageContainer from '../layouts/classic/ContentPage';

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
