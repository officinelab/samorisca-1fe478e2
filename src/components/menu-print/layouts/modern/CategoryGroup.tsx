
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
        marginBottom: '18mm',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      }} 
      className="category"
    >
      <h2 style={{
        fontSize: '22pt',
        fontWeight: 'bold',
        marginBottom: '8mm',
        textTransform: 'uppercase',
        textAlign: 'center',
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
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryGroup;
