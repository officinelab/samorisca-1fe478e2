
import React from 'react';
import { Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { usePageOrganizer } from './PageOrganizer';
import ContentPage from './ContentPage';

interface ContentPagesProps {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  customLayout?: PrintLayout | null;
}

const ContentPages: React.FC<ContentPagesProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  categories,
  products,
  selectedCategories,
  language,
  customLayout
}) => {
  // Use the page organizer hook to divide categories into pages
  const pages = usePageOrganizer({ 
    categories, 
    products, 
    selectedCategories 
  });

  return (
    <>
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
    </>
  );
};

export default ContentPages;
