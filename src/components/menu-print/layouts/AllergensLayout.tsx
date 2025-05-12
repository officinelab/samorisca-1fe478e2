
import React, { useEffect } from 'react';
import { Category, Product, Allergen } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import CoverPage from '../shared/CoverPage';
import AllergensPage from '../shared/AllergensPage';
import AllergensContentPage from './allergens/AllergensContentPage';
import { usePageOrganizer } from './allergens/PageOrganizer';

type AllergensLayoutProps = {
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

const AllergensLayout: React.FC<AllergensLayoutProps> = ({
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
    console.log("AllergensLayout - customLayout:", customLayout);
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
        layoutType="allergens"
        restaurantLogo={restaurantLogo}
      />

      {/* Pagina degli allergeni all'inizio */}
      {printAllergens && allergens.length > 0 && (
        <AllergensPage
          A4_WIDTH_MM={A4_WIDTH_MM}
          A4_HEIGHT_MM={A4_HEIGHT_MM}
          showPageBoundaries={showPageBoundaries}
          allergens={allergens}
          layoutType="allergens"
          restaurantLogo={restaurantLogo}
          customLayout={customLayout}
        />
      )}
      
      {/* Pagine di contenuto */}
      {pages.map((pageCategories, pageIndex) => (
        <AllergensContentPage
          key={`page-${pageIndex}`}
          A4_WIDTH_MM={A4_WIDTH_MM}
          A4_HEIGHT_MM={A4_HEIGHT_MM}
          showPageBoundaries={showPageBoundaries}
          pageCategories={pageCategories}
          products={products}
          language={language}
          allergens={allergens}
          customLayout={customLayout}
          pageIndex={pageIndex}
        />
      ))}
    </>
  );
};

export default AllergensLayout;
