
import React from 'react';
import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import Schema1Layout from './schemas/Schema1Layout';
import Schema2Layout from './schemas/Schema2Layout';
import Schema3Layout from './schemas/Schema3Layout';

interface ProductItemProps {
  product: Product;
  language: string;
  customLayout?: PrintLayout | null;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, language, customLayout }) => {
  // Determina lo schema da utilizzare (default: schema1)
  const productSchema = customLayout?.productSchema || "schema1";

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
      {productSchema === "schema1" && (
        <Schema1Layout 
          product={product} 
          language={language} 
          customLayout={customLayout} 
        />
      )}
      
      {productSchema === "schema2" && (
        <Schema2Layout 
          product={product} 
          language={language} 
          customLayout={customLayout} 
        />
      )}
      
      {productSchema === "schema3" && (
        <Schema3Layout 
          product={product} 
          language={language} 
          customLayout={customLayout} 
        />
      )}
    </div>
  );
};

export default ProductItem;
