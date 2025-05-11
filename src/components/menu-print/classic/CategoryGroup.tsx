
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
  // Utility function for generating element styles from config
  const getElementStyle = (config: PrintLayout["elements"]["category"] | undefined, defaultStyle: React.CSSProperties = {}) => {
    if (!config) return defaultStyle;
    
    return {
      ...defaultStyle,
      fontFamily: config.fontFamily,
      fontSize: `${config.fontSize}pt`,
      color: config.fontColor,
      fontWeight: config.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: config.fontStyle === 'italic' ? 'italic' : 'normal',
      textAlign: config.alignment,
      marginTop: `${config.margin.top}mm`,
      marginRight: `${config.margin.right}mm`,
      marginBottom: `${config.margin.bottom}mm`,
      marginLeft: `${config.margin.left}mm`,
      visibility: config.visible ? 'visible' : 'hidden',
      display: config.visible ? 'block' : 'none',
    } as React.CSSProperties;
  };

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
      {(!customLayout || customLayout.elements.category.visible) && (
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
