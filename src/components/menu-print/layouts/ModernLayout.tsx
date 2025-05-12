
import React, { useEffect } from 'react';
import { Category, Product, Allergen } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import CoverPage from '../shared/CoverPage';
import AllergensPage from '../shared/AllergensPage';
import ContentPage from './modern/ContentPage';
import { usePageOrganizer } from './modern/PageOrganizer';

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
  // Debug log to verify custom layout is passed correctly
  useEffect(() => {
    console.log("ModernLayout - customLayout:", customLayout);
  }, [customLayout]);
  
  // Usa l'organizzatore di pagine per dividere le categorie in pagine
  const pages = usePageOrganizer({ 
    categories, 
    products, 
    selectedCategories 
  });

  return (
    <>
      {/* Pagina di copertina */}
      <CoverPage 
        A4_WIDTH_MM={A4_WIDTH_MM} 
        A4_HEIGHT_MM={A4_HEIGHT_MM} 
        showPageBoundaries={showPageBoundaries}
        layoutType="modern"
        restaurantLogo={restaurantLogo}
      />

      {/* Pagine di contenuto */}
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
          
      {/* Pagina allergeni (opzionale) */}
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
