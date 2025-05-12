
import React from 'react';
import { Category, Product } from '@/types/database';
import ProductItem from './ProductItem';

interface CategoryGroupProps {
  category: Category;
  products: Product[];
  language: string;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({ 
  category, 
  products, 
  language 
}) => {
  return (
    <div 
      style={{
        marginBottom: '15mm',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      }} 
      className="category"
    >
      <h2 style={{
        fontSize: '18pt',
        fontWeight: 'bold',
        marginBottom: '5mm',
        textTransform: 'uppercase',
        borderBottom: '1px solid #000',
        paddingBottom: '2mm'
      }} className="category-title">
        {category[`title_${language}`] || category.title}
      </h2>
      
      <div>
        {products?.map((product) => (
          <ProductItem 
            key={product.id} 
            product={product} 
            language={language} 
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryGroup;
