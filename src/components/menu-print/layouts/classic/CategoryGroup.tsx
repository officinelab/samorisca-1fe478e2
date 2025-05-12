
import React from 'react';
import { Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import ProductItem from './ProductItem';
import { getElementStyle } from '../../utils/styleUtils';
import RepeatedCategoryTitle from '../../pagination/RepeatedCategoryTitle';

interface CategoryGroupProps {
  category: Category;
  products: Product[];
  language: string;
  customLayout?: PrintLayout | null;
  isRepeatedTitle?: boolean;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({ 
  category, 
  products, 
  language,
  customLayout,
  isRepeatedTitle = false
}) => {
  // Define properly typed CSS properties
  const categoryStyle: React.CSSProperties = customLayout 
    ? getElementStyle(customLayout.elements.category, {
        marginBottom: `${customLayout.spacing.categoryTitleBottomMargin}mm`,
        fontWeight: 'bold',
        textTransform: 'uppercase' as const,
        borderBottom: '1px solid #000',
        paddingBottom: '2mm'
      })
    : {
        fontSize: '18pt',
        fontWeight: 'bold',
        marginBottom: '5mm',
        textTransform: 'uppercase' as const,
        borderBottom: '1px solid #000',
        paddingBottom: '2mm'
      };

  const containerStyle: React.CSSProperties = {
    marginBottom: customLayout ? `${customLayout.spacing.betweenCategories}mm` : '15mm',
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
  };

  return (
    <div style={containerStyle} className="category">
      {(!customLayout || customLayout.elements.category.visible) && (
        <RepeatedCategoryTitle 
          category={category}
          language={language}
          customLayout={customLayout}
          isRepeated={isRepeatedTitle}
        />
      )}
      
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
