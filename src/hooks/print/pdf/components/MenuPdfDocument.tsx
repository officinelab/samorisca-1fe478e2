
import React from 'react';
import { Document } from '@react-pdf/renderer';
import { Allergen, Category, Product } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";
import CoverPagePdf from './cover/CoverPagePdf';
import MenuContentPdf from './content/MenuContentPdf';
import AllergensPdf from './allergens/AllergensPdf';

interface MenuPdfDocumentProps {
  styles: any;
  categories: Category[];
  products: Record<string, Product[]>;
  language: string;
  allergens: Allergen[];
  printAllergens: boolean;
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
}

const MenuPdfDocument: React.FC<MenuPdfDocumentProps> = ({ 
  styles,
  categories,
  products,
  language,
  allergens,
  printAllergens,
  restaurantLogo,
  customLayout
}) => {
  console.log("MenuPdfDocument - received logo:", restaurantLogo);
  console.log("MenuPdfDocument - layout:", customLayout?.type);
  console.log("MenuPdfDocument - categories count:", categories.length);

  return (
    <Document>
      <CoverPagePdf 
        styles={styles} 
        restaurantLogo={restaurantLogo} 
        customLayout={customLayout} 
        isPageZero={true}
      />
      
      {categories.map((category, index) => (
        <MenuContentPdf 
          key={category.id}
          styles={styles} 
          categories={[category]}
          products={products} 
          language={language}
          customLayout={customLayout}
          pageIndex={index + 1} // Consideriamo la prima pagina di contenuto come pagina 1
        />
      ))}
      
      {printAllergens && allergens.length > 0 && (
        <AllergensPdf 
          styles={styles} 
          allergens={allergens} 
          printAllergens={printAllergens}
          customLayout={customLayout}
        />
      )}
    </Document>
  );
};

export default MenuPdfDocument;
