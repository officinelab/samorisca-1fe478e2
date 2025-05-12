
import React, { useEffect } from 'react';
import { Category, Product, Allergen } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import CoverPage from '../shared/CoverPage';
import AllergensPage from '../shared/AllergensPage';
import PaginatedContent from '../pagination/PaginatedContent';

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

  return (
    <>
      {/* Pagina di copertina */}
      <CoverPage 
        A4_WIDTH_MM={A4_WIDTH_MM} 
        A4_HEIGHT_MM={A4_HEIGHT_MM} 
        showPageBoundaries={showPageBoundaries}
        layoutType={customLayout?.type || "classic"}
        restaurantLogo={restaurantLogo}
      />

      {/* Contenuto paginato che gestisce automaticamente l'interruzione delle pagine */}
      <PaginatedContent
        A4_WIDTH_MM={A4_WIDTH_MM}
        A4_HEIGHT_MM={A4_HEIGHT_MM}
        showPageBoundaries={showPageBoundaries}
        categories={categories}
        products={products}
        selectedCategories={selectedCategories}
        language={language}
        customLayout={customLayout}
      />
          
      {/* Pagina degli allergeni */}
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
