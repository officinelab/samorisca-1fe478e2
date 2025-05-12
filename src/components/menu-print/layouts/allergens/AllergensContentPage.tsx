
import React from 'react';
import { Category, Allergen } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import CategoryGroup from './CategoryGroup';

interface ContentPageProps {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  pageCategories: Category[];
  products: Record<string, any[]>;
  language: string;
  allergens: Allergen[];
  pageIndex: number;
  customLayout?: PrintLayout | null;
}

const AllergensContentPage: React.FC<ContentPageProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  pageCategories,
  products,
  language,
  allergens,
  pageIndex,
  customLayout
}) => {
  // Determine page margins based on layout settings
  const getPageMargins = () => {
    if (!customLayout) {
      return '20mm 15mm 20mm 15mm'; // Default margins
    }

    // If distinct margins are not enabled
    if (!customLayout.page.useDistinctMarginsForPages) {
      return `${customLayout.page.marginTop}mm ${customLayout.page.marginRight}mm ${customLayout.page.marginBottom}mm ${customLayout.page.marginLeft}mm`;
    }
    
    // Get appropriate margins based on page index (odd/even)
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
    
    // Use odd page margins for even indices (0, 2, 4...) which correspond to pages 1, 3, 5...
    if (pageIndex % 2 === 0) {
      return `${oddPages.marginTop}mm ${oddPages.marginRight}mm ${oddPages.marginBottom}mm ${oddPages.marginLeft}mm`;
    } else {
      return `${evenPages.marginTop}mm ${evenPages.marginRight}mm ${evenPages.marginBottom}mm ${evenPages.marginLeft}mm`;
    }
  };
  
  const pageMargins = getPageMargins();
    
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
            allergens={allergens}
            customLayout={customLayout}
          />
        ))}
      </div>
    </div>
  );
};

export default AllergensContentPage;
