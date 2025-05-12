
import React from 'react';
import { Product } from '@/types/database';

interface ProductItemProps {
  product: Product;
  language: string;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, language }) => {
  return (
    <div 
      style={{
        marginBottom: '6mm',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        padding: '2mm',
      }} 
      className="menu-item"
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: '3mm',
      }} className="item-header">
        <div style={{
          fontWeight: 'bold',
          fontSize: '14pt',
          width: 'auto',
          maxWidth: '75%'
        }} className="item-title">
          {product[`title_${language}`] || product.title}
        </div>
        
        <div style={{
          textAlign: 'right',
          fontWeight: 'bold',
          fontSize: '13pt',
          width: 'auto',
          backgroundColor: '#f5f5f5',
          padding: '2px 8px',
          borderRadius: '4px',
        }} className="item-price">
          € {product.price_standard}
        </div>
      </div>
      
      {(product[`description_${language}`] || product.description) && (
        <div style={{
          fontSize: '11pt',
          marginBottom: '2mm',
          width: '100%',
          maxWidth: '95%',
          lineHeight: '1.4',
        }} className="item-description">
          {product[`description_${language}`] || product.description}
        </div>
      )}
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {product.allergens && product.allergens.length > 0 && (
          <div style={{
            fontSize: '10pt',
            color: '#666',
          }} className="item-allergens">
            Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
          </div>
        )}
        
        {product.has_multiple_prices && (
          <div style={{
            fontSize: '10pt',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginLeft: 'auto'
          }} className="price-variants">
            {product.price_variant_1_name && (
              <div>{product.price_variant_1_name}: € {product.price_variant_1_value}</div>
            )}
            {product.price_variant_2_name && (
              <div>{product.price_variant_2_name}: € {product.price_variant_2_value}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
