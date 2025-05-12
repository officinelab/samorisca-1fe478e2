
import React from 'react';
import { Category, Product, Allergen } from '@/types/database';
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
}) => {
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
        layoutType="classic"
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
          layoutType="classic"
          restaurantLogo={restaurantLogo}
        />
      )}
    </>
  );
};

export default ClassicLayout;
