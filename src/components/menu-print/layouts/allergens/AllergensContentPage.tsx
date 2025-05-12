
import React from 'react';
import { Category, Allergen } from '@/types/database';
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
}

const AllergensContentPage: React.FC<ContentPageProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  pageCategories,
  products,
  language,
  allergens,
  pageIndex
}) => {
  return (
    <div className="page relative bg-white" style={{
      width: `${A4_WIDTH_MM}mm`,
      height: `${A4_HEIGHT_MM}mm`,
      padding: '20mm 15mm',
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
          />
        ))}
      </div>
    </div>
  );
};

export default AllergensContentPage;
