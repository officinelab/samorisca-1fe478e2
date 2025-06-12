
import React from 'react';
import { Document } from '@react-pdf/renderer';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product, Allergen } from '@/types/database';
import NewCoverPagePdf from './NewCoverPagePdf';
import NewMenuContentPdf from './NewMenuContentPdf';
import NewAllergensPdf from './NewAllergensPdf';

interface NewMenuPdfDocumentProps {
  currentLayout: PrintLayout;
  categories: Category[];
  products: Record<string, Product[]>;
  allergens: Allergen[];
  restaurantLogo?: string | null;
  language: string;
  printAllergens: boolean;
}

const NewMenuPdfDocument: React.FC<NewMenuPdfDocumentProps> = ({
  currentLayout,
  categories,
  products,
  allergens,
  restaurantLogo,
  language,
  printAllergens
}) => {
  console.log('📄 Rendering NewMenuPdfDocument con:', {
    layoutName: currentLayout?.name,
    categoriesCount: categories?.length || 0,
    productsCount: Object.keys(products || {}).length,
    allergensCount: allergens?.length || 0,
    hasLogo: !!restaurantLogo,
    language,
    printAllergens
  });

  return (
    <Document>
      {/* Cover Page */}
      <NewCoverPagePdf
        currentLayout={currentLayout}
        restaurantLogo={restaurantLogo}
      />
      
      {/* Empty Cover Page (back of cover) */}
      <NewCoverPagePdf
        currentLayout={currentLayout}
        restaurantLogo={restaurantLogo}
        isEmpty={true}
      />
      
      {/* Content Pages */}
      {categories && categories.length > 0 && categories.map((category) => {
        const categoryProducts = products[category.id] || [];
        console.log(`📂 Rendering categoria: ${category.title} con ${categoryProducts.length} prodotti`);
        
        return (
          <NewMenuContentPdf
            key={category.id}
            currentLayout={currentLayout}
            category={category}
            products={categoryProducts}
            language={language}
          />
        );
      })}
      
      {/* Allergens Page */}
      {printAllergens && allergens && allergens.length > 0 && (
        <NewAllergensPdf
          currentLayout={currentLayout}
          allergens={allergens}
          language={language}
        />
      )}
    </Document>
  );
};

export default NewMenuPdfDocument;
