
import React, { useRef, useState, useEffect } from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';
import { usePageBreakCalculator } from '@/hooks/print/usePageBreakCalculator';
import ContentPage from '../layouts/classic/ContentPage';

interface PaginatedContentProps {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  customLayout?: PrintLayout | null;
}

const PaginatedContent: React.FC<PaginatedContentProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  categories,
  products,
  selectedCategories,
  language,
  customLayout
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<Category[][]>([]);
  
  // Determina i margini della pagina in base al layout
  const pageMarginTop = customLayout?.page.marginTop || 20;
  const pageMarginBottom = customLayout?.page.marginBottom || 20;
  
  // Usa il hook per calcolare i punti di interruzione di pagina
  const { pageBreaks } = usePageBreakCalculator({
    A4_HEIGHT_MM,
    pageMarginTop,
    pageMarginBottom,
    containerRef: contentRef,
    customLayout
  });
  
  // Filtra le categorie selezionate
  const filteredCategories = categories.filter(cat => selectedCategories.includes(cat.id));
  
  // Organizza i contenuti in pagine
  useEffect(() => {
    const organizeContentByPages = () => {
      if (filteredCategories.length === 0) {
        setPages([[]]);
        return;
      }
      
      // Implementazione semplificata: ogni categoria in una pagina
      // Questo verrà migliorato dal sistema di calcolo dei punti di interruzione
      const result: Category[][] = [];
      let currentPage: Category[] = [];
      
      filteredCategories.forEach(category => {
        currentPage.push(category);
        
        // Per ora suddivide per categoria, ma il sistema completo userà pageBreaks
        result.push([...currentPage]);
        currentPage = [];
      });
      
      if (currentPage.length > 0) {
        result.push(currentPage);
      }
      
      setPages(result.length > 0 ? result : [[]]);
    };
    
    organizeContentByPages();
  }, [filteredCategories, pageBreaks]);
  
  return (
    <div ref={contentRef}>
      {/* Renderizza le pagine di contenuto */}
      {pages.map((pageCategories, pageIndex) => (
        <ContentPage
          key={`content-page-${pageIndex}`}
          A4_WIDTH_MM={A4_WIDTH_MM}
          A4_HEIGHT_MM={A4_HEIGHT_MM}
          showPageBoundaries={showPageBoundaries}
          pageCategories={pageCategories}
          products={products}
          language={language}
          pageIndex={pageIndex}
          customLayout={customLayout}
        />
      ))}
    </div>
  );
};

export default PaginatedContent;
