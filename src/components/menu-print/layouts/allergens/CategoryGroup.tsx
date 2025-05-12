
import React from 'react';
import { Category, Product, Allergen } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import ProductItem from './ProductItem';
import { getElementStyle } from '../../utils/styleUtils';

interface CategoryGroupProps {
  category: Category;
  products: Product[];
  language: string;
  allergens: Allergen[];
  customLayout?: PrintLayout | null;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({ 
  category, 
  products, 
  language,
  allergens,
  customLayout
}) => {
  return (
    <div 
      style={{
        marginBottom: customLayout ? 
          `${customLayout.spacing.betweenCategories}mm` : 
          '15mm',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        backgroundColor: '#f9f9f9',
        padding: '10px',
        borderRadius: '5px',
      }} 
      className="category"
    >
      {(!customLayout || customLayout.elements.category.visible) && (
        <h2 style={getElementStyle(customLayout?.elements.category, {
          fontSize: '18pt',
          fontWeight: 'bold',
          marginBottom: customLayout ? 
            `${customLayout.spacing.categoryTitleBottomMargin}mm` : 
            '8mm',
          textAlign: 'center',
          borderBottom: '2px solid #555',
          paddingBottom: '5px',
        })} className="category-title">
          {category[`title_${language}`] || category.title}
        </h2>
      )}
      
      <div>
        {products?.map((product) => (
          <ProductItem 
            key={product.id} 
            product={product} 
            language={language}
            allergens={allergens}
            customLayout={customLayout}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryGroup;
