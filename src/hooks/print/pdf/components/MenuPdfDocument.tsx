
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
  menuTitle?: string;
  menuSubtitle?: string;
}

const MenuPdfDocument: React.FC<MenuPdfDocumentProps> = ({ 
  styles,
  categories,
  products,
  language,
  allergens,
  printAllergens,
  restaurantLogo,
  customLayout,
  menuTitle = "Menu",
  menuSubtitle = "Ristorante"
}) => {
  // Aggiungiamo log per verificare che i titoli arrivino correttamente
  console.log("MenuPdfDocument riceve titolo:", menuTitle, "sottotitolo:", menuSubtitle);
  
  return (
    <Document>
      <CoverPagePdf 
        styles={styles} 
        restaurantLogo={restaurantLogo} 
        customLayout={customLayout} 
        isPageZero={true}
        menuTitle={menuTitle}
        menuSubtitle={menuSubtitle}
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
