
import React from 'react';
import { Allergen } from '@/types/database';
import PageContainer from './allergens/PageContainer';
import AllergenHeader from './allergens/AllergenHeader';
import AllergensList from './allergens/AllergensList';

type AllergensPageProps = {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  allergens: Allergen[];
  layoutType?: 'classic' | 'modern' | 'allergens';
  restaurantLogo?: string | null;
};

const AllergensPage: React.FC<AllergensPageProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  allergens,
  layoutType = 'classic',
  restaurantLogo
}) => {
  return (
    <PageContainer
      A4_WIDTH_MM={A4_WIDTH_MM}
      A4_HEIGHT_MM={A4_HEIGHT_MM}
      showPageBoundaries={showPageBoundaries}
      layoutType={layoutType}
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
