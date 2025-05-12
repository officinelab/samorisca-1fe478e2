
import React, { useEffect } from 'react';
import { Category } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import CategoryGroup from './CategoryGroup';

interface ContentPageProps {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  pageCategories: Category[];
  products: Record<string, any[]>;
  language: string;
  customLayout?: PrintLayout | null;
  pageIndex: number;
}

const ContentPage: React.FC<ContentPageProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  pageCategories,
  products,
  language,
  customLayout,
  pageIndex
}) => {
  // Debug log to verify custom layout is passed correctly
  useEffect(() => {
    console.log("ContentPage [Classic] - customLayout:", customLayout);
    console.log("ContentPage [Classic] - pageIndex:", pageIndex);
  }, [customLayout, pageIndex]);
  
  // Determina i margini della pagina in base a pari/dispari
  const getPageMargins = () => {
    if (!customLayout) {
      return '20mm 15mm 20mm 15mm'; // Margini predefiniti se non c'è un layout personalizzato
    }

    // Se non è attivata l'opzione per i margini distinti, usa i margini generali
    if (!customLayout.page.useDistinctMarginsForPages) {
      return `${customLayout.page.marginTop}mm ${customLayout.page.marginRight}mm ${customLayout.page.marginBottom}mm ${customLayout.page.marginLeft}mm`;
    }
    
    // Assicurati che oddPages e evenPages siano definiti
    const oddPages = customLayout.page.oddPages || {
      marginTop: customLayout.page.marginTop,
      marginRight: customLayout.page.marginRight,
      marginBottom: customLayout.page.marginBottom,
      marginLeft: customLayout.page.marginLeft
    };
    
    const evenPages = customLayout.page.evenPages || {
      marginTop: customLayout.page.marginTop,
      marginRight: customLayout.page.marginRight,
      marginBottom: customLayout.page.marginBottom,
      marginLeft: customLayout.page.marginLeft
    };
    
    // Pagina dispari (0-based, quindi pageIndex 0, 2, 4... sono pagine 1, 3, 5...)
    if (pageIndex % 2 === 0) {
      return `${oddPages.marginTop}mm ${oddPages.marginRight}mm ${oddPages.marginBottom}mm ${oddPages.marginLeft}mm`;
    } 
    // Pagina pari (1, 3, 5...)
    else {
      return `${evenPages.marginTop}mm ${evenPages.marginRight}mm ${evenPages.marginBottom}mm ${evenPages.marginLeft}mm`;
    }
  };
  
  const pageMargins = getPageMargins();
  console.log("ContentPage [Classic] - Page margins:", pageMargins);
  
  return (
    <div className="page relative bg-white" style={{
      width: `${A4_WIDTH_MM}mm`,
      height: `${A4_HEIGHT_MM}mm`,
      padding: pageMargins,
      boxSizing: 'border-box',
      margin: '0 auto 60px auto',
      pageBreakAfter: 'always',
      breakAfter: 'page',
      border: showPageBoundaries ? '2px solid #e2e8f0' : 'none',
      boxShadow: showPageBoundaries ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
    }}>
      <div className="menu-container" style={{ 
        overflow: 'visible',
        height: 'auto',
        position: 'relative'
      }}>
        {pageCategories.map((category) => (
          <CategoryGroup 
            key={category.id}
            category={category}
            products={products[category.id] || []}
            language={language}
            customLayout={customLayout}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentPage;
