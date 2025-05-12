
import React from 'react';
import { Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import ProductItem from './ProductItem';
import { getElementStyle } from '../../utils/styleUtils';

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
  // Get style from custom layout if available, otherwise use default styles
  const categoryStyle = customLayout 
    ? getElementStyle(customLayout.elements.category, {
        marginBottom: `${customLayout.spacing.categoryTitleBottomMargin}mm`,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderBottom: '1px solid #000',
        paddingBottom: '2mm'
      })
    : {
        fontSize: '18pt',
        fontWeight: 'bold',
        marginBottom: '5mm',
        textTransform: 'uppercase',
        borderBottom: '1px solid #000',
        paddingBottom: '2mm'
      };

  const containerStyle = {
    marginBottom: customLayout ? `${customLayout.spacing.betweenCategories}mm` : '15mm',
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
  } as React.CSSProperties;

  return (
    <div style={containerStyle} className="category">
      <h2 style={categoryStyle} className="category-title">
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
