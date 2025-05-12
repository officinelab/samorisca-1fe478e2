
import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { Category, Product } from "@/types/database";
import { PrintLayout } from '@/types/printLayout';
import CategorySection from './CategorySection';

interface MenuContentPdfProps {
  styles: any;
  categories: Category[];
  products: Record<string, Product[]>;
  language: string;
  customLayout?: PrintLayout | null;
  pageIndex?: number;
}

const MenuContentPdf: React.FC<MenuContentPdfProps> = ({ 
  styles, 
  categories, 
  products, 
  language,
  customLayout,
  pageIndex = 0
}) => {
  return (
    <Page size="A4" style={pageIndex % 2 === 0 ? styles.oddPage : styles.evenPage}>
      {categories.map((category) => (
        <CategorySection
          key={category.id}
          category={category}
          products={products[category.id] || []}
          styles={styles}
          language={language}
          customLayout={customLayout}
        />
      ))}
      
      <Text 
        style={styles.pageNumber} 
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
      />
    </Page>
  );
};

export default MenuContentPdf;
