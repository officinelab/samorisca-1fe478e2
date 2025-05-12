
import React, { useEffect } from 'react';
import { Category, Product, Allergen } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import CoverPage from '../shared/CoverPage';
import AllergensPage from '../shared/AllergensPage';
import ContentPage from './classic/ContentPage';
import { usePageOrganizer } from './classic/PageOrganizer';

type ClassicLayoutProps = {
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

const ClassicLayout: React.FC<ClassicLayoutProps> = ({
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
  // Debug log per verificare che il customLayout venga passato correttamente
  useEffect(() => {
    console.log("ClassicLayout - customLayout:", customLayout);
  }, [customLayout]);
  
  // Use our hook to organize categories into pages
  const pages = usePageOrganizer({ 
    categories, 
    products, 
    selectedCategories 
  });

  return (
    <>
      {/* Cover page */}
      <CoverPage 
        A4_WIDTH_MM={A4_WIDTH_MM} 
        A4_HEIGHT_MM={A4_HEIGHT_MM} 
        showPageBoundaries={showPageBoundaries}
        layoutType={customLayout?.type || "classic"}
        restaurantLogo={restaurantLogo}
      />

      {/* Content pages */}
      {pages.map((pageCategories, pageIndex) => (
        <ContentPage
          key={`page-${pageIndex}`}
          A4_WIDTH_MM={A4_WIDTH_MM}
          A4_HEIGHT_MM={A4_HEIGHT_MM}
          showPageBoundaries={showPageBoundaries}
          pageCategories={pageCategories}
          products={products}
          language={language}
          customLayout={customLayout}
          pageIndex={pageIndex}
        />
      ))}
          
      {/* Allergens page */}
      {printAllergens && allergens.length > 0 && (
        <AllergensPage
          A4_WIDTH_MM={A4_WIDTH_MM}
          A4_HEIGHT_MM={A4_HEIGHT_MM}
          showPageBoundaries={showPageBoundaries}
          allergens={allergens}
          layoutType={customLayout?.type || "classic"}
          restaurantLogo={restaurantLogo}
        />
      )}
    </>
  );
};

export default ClassicLayout;
