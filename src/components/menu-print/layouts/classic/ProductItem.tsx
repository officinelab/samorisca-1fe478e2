
import React from 'react';
import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import Schema1Layout from './schemas/Schema1Layout';

interface ProductItemProps {
  product: Product;
  language: string;
  customLayout?: PrintLayout | null;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, language, customLayout }) => {
  return (
    <div 
      style={{
        marginBottom: customLayout ? 
          `${customLayout.spacing.betweenProducts}mm` : 
          '5mm',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      }} 
      className="menu-item"
    >
      <Schema1Layout 
        product={product} 
        language={language} 
        customLayout={customLayout} 
      />
    </div>
  );
};

export default ProductItem;
