
import React from 'react';
import { Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import ProductItem from './ProductItem';
import { getElementStyle } from '../utils/styleUtils';

interface CategoryGroupProps {
  category: Category;
  products: Product[];
  language: string;
  customLayout?: PrintLayout | null;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({ 
  category, 
  products, 
  language, 
  customLayout 
}) => {
  return (
    <div key={category.id} 
      style={{
        marginBottom: customLayout ? 
          `${customLayout.spacing.betweenCategories}mm` : 
          '15mm',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      }} 
      className="category">
      {/* Il titolo categoria è sempre visibile ora */}
      <h2 style={getElementStyle(customLayout?.elements.category, {
        fontSize: '18pt',
        fontWeight: 'bold',
        marginBottom: customLayout ? 
          `${customLayout.spacing.categoryTitleBottomMargin}mm` : 
          '5mm',
        textTransform: 'uppercase',
        borderBottom: '1px solid #000',
        paddingBottom: '2mm'
      })} className="category-title">
        {category[`title_${language}`] || category.title}
      </h2>
      <div>
        {products?.map((product) => (
          <ProductItem 
            key={product.id} 
            product={product} 
            language={language} 
            customLayout={customLayout} 
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryGroup;
