
import React from 'react';
import { Category, Product, Allergen } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import CoverPage from './layouts/modern/CoverPage';
import ContentPages from './layouts/modern/ContentPages';
import AllergensPage from './AllergensPage';

type ModernLayoutProps = {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  allergens: Allergen[];
  printAllergens: boolean;
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
};

const ModernLayout: React.FC<ModernLayoutProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  categories,
  products,
  selectedCategories,
  language,
  allergens,
  printAllergens,
  restaurantLogo,
  customLayout
}) => {
  return (
    <>
      {/* Cover page */}
      <CoverPage 
        A4_WIDTH_MM={A4_WIDTH_MM} 
        A4_HEIGHT_MM={A4_HEIGHT_MM} 
        showPageBoundaries={showPageBoundaries}
        restaurantLogo={restaurantLogo}
      />

      {/* Content pages */}
      <ContentPages 
        A4_WIDTH_MM={A4_WIDTH_MM}
        A4_HEIGHT_MM={A4_HEIGHT_MM}
        showPageBoundaries={showPageBoundaries}
        categories={categories}
        products={products}
        selectedCategories={selectedCategories}
        language={language}
        customLayout={customLayout}
      />
      
      {/* Allergens page (optional) */}
      {printAllergens && allergens.length > 0 && (
        <AllergensPage
          A4_WIDTH_MM={A4_WIDTH_MM}
          A4_HEIGHT_MM={A4_HEIGHT_MM}
          showPageBoundaries={showPageBoundaries}
          allergens={allergens}
          layoutType="modern"
          restaurantLogo={restaurantLogo}
          customLayout={customLayout}
        />
      )}
    </>
  );
};

export default ModernLayout;
