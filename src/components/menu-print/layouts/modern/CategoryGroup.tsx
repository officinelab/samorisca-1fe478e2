
import React from 'react';
import { Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import ProductItem from './ProductItem';

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
      <h2 style={{
        fontSize: customLayout?.elements.category.fontSize ? 
          `${customLayout.elements.category.fontSize}pt` : 
          '22pt',
        fontWeight: customLayout?.elements.category.fontStyle === 'bold' || !customLayout ? 
          'bold' : 
          'normal',
        fontStyle: customLayout?.elements.category.fontStyle === 'italic' ? 
          'italic' : 
          'normal',
        marginBottom: customLayout ? 
          `${customLayout.spacing.categoryTitleBottomMargin}mm` : 
          '8mm',
        textAlign: customLayout?.elements.category.alignment || 'center',
        position: 'relative',
        paddingBottom: '3mm',
      }} className="category-title">
        {category[`title_${language}`] || category.title}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '30%',
          width: '40%',
          height: '2px',
          backgroundColor: '#000'
        }}></div>
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
