
import React from 'react';
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
  return (
    <div key={`page-${pageIndex}`} className="page relative bg-white" style={{
      width: `${A4_WIDTH_MM}mm`,
      height: `${A4_HEIGHT_MM}mm`,
      padding: customLayout ? 
        `${customLayout.page.marginTop}mm ${customLayout.page.marginRight}mm ${customLayout.page.marginBottom}mm ${customLayout.page.marginLeft}mm` :
        '20mm 15mm 20mm 15mm',
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
