
import React from 'react';
import { Allergen } from '@/types/database';
import CoverPage from './CoverPage';
import AllergensPage from './AllergensPage';

type AllergensLayoutProps = {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  allergens: Allergen[];
  restaurantLogo?: string | null;
};

const AllergensLayout: React.FC<AllergensLayoutProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  allergens,
  restaurantLogo
}) => {
  return (
    <>
      {/* Pagina di copertina */}
      <CoverPage 
        A4_WIDTH_MM={A4_WIDTH_MM} 
        A4_HEIGHT_MM={A4_HEIGHT_MM} 
        showPageBoundaries={showPageBoundaries}
        layoutType="allergens"
        restaurantLogo={restaurantLogo}
      />

      {/* Pagina degli allergeni */}
      <AllergensPage
        A4_WIDTH_MM={A4_WIDTH_MM}
        A4_HEIGHT_MM={A4_HEIGHT_MM}
        showPageBoundaries={showPageBoundaries}
        allergens={allergens}
        layoutType="allergens"
        restaurantLogo={restaurantLogo}
      />
    </>
  );
};

export default AllergensLayout;
