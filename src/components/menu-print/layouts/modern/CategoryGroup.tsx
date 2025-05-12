
import React from 'react';
import { Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import ProductItem from './ProductItem';
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
  return (
    <div 
      style={{
        marginBottom: customLayout ? 
          `${customLayout.spacing.betweenCategories}mm` : 
          '18mm',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      }} 
      className="category"
    >
      <RepeatedCategoryTitle 
        category={category}
        language={language}
        customLayout={customLayout}
        isRepeated={isRepeatedTitle}
      />
      
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
