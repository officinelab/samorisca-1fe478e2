
import React from 'react';
import { Category, Product, Allergen } from '@/types/database';
import ProductItem from './ProductItem';

interface CategoryGroupProps {
  category: Category;
  products: Product[];
  language: string;
  allergens: Allergen[];
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({ 
  category, 
  products, 
  language,
  allergens
}) => {
  return (
    <div 
      style={{
        marginBottom: '15mm',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        backgroundColor: '#f9f9f9',
        padding: '10px',
        borderRadius: '5px',
      }} 
      className="category"
    >
      <h2 style={{
        fontSize: '18pt',
        fontWeight: 'bold',
        marginBottom: '8mm',
        textAlign: 'center',
        borderBottom: '2px solid #555',
        paddingBottom: '5px',
      }} className="category-title">
        {category[`title_${language}`] || category.title}
      </h2>
      
      <div>
        {products?.map((product) => (
          <ProductItem 
            key={product.id} 
            product={product} 
            language={language}
            allergens={allergens}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryGroup;
