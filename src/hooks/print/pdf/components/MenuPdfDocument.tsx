
import React from 'react';
import { Document } from '@react-pdf/renderer';
import { Allergen, Category, Product } from "@/types/database";
import CoverPagePdf from './CoverPagePdf';
import MenuContentPdf from './MenuContentPdf';
import AllergensPdf from './AllergensPdf';

interface MenuPdfDocumentProps {
  styles: any;
  categories: Category[];
  products: Record<string, Product[]>;
  language: string;
  allergens: Allergen[];
  printAllergens: boolean;
  restaurantLogo?: string | null;
}

const MenuPdfDocument: React.FC<MenuPdfDocumentProps> = ({ 
  styles,
  categories,
  products,
  language,
  allergens,
  printAllergens,
  restaurantLogo
}) => {
  return (
    <Document>
      <CoverPagePdf styles={styles} restaurantLogo={restaurantLogo} />
      <MenuContentPdf 
        styles={styles} 
        categories={categories} 
        products={products} 
        language={language} 
      />
      <AllergensPdf 
        styles={styles} 
        allergens={allergens} 
        printAllergens={printAllergens} 
      />
    </Document>
  );
};

export default MenuPdfDocument;
