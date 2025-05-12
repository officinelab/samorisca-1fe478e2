
import React from 'react';
import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { getElementStyle } from '../../utils/styleUtils';

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
          '6mm',
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
        {(!customLayout || customLayout.elements.title.visible) && (
          <div style={getElementStyle(customLayout?.elements.title, {
            fontWeight: 'bold',
            fontSize: '14pt',
            width: 'auto',
            maxWidth: '75%'
          })} className="item-title">
            {product[`title_${language}`] || product.title}
          </div>
        )}
        
        {(!customLayout || customLayout.elements.price.visible) && (
          <div style={getElementStyle(customLayout?.elements.price, {
            textAlign: 'right',
            fontWeight: 'bold',
            fontSize: '13pt',
            width: 'auto',
            backgroundColor: '#f5f5f5',
            padding: '2px 8px',
            borderRadius: '4px',
          })} className="item-price">
            € {product.price_standard}
          </div>
        )}
      </div>
      
      {(!customLayout || customLayout.elements.description.visible) && 
        (product[`description_${language}`] || product.description) && (
        <div style={getElementStyle(customLayout?.elements.description, {
          fontSize: '11pt',
          marginBottom: '2mm',
          width: '100%',
          maxWidth: '95%',
          lineHeight: '1.4',
        })} className="item-description">
          {product[`description_${language}`] || product.description}
        </div>
      )}
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {(!customLayout || customLayout.elements.allergensList.visible) && 
          product.allergens && product.allergens.length > 0 && (
          <div style={getElementStyle(customLayout?.elements.allergensList, {
            fontSize: '10pt',
            color: '#666',
          })} className="item-allergens">
            Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
          </div>
        )}
        
        {(!customLayout || customLayout.elements.priceVariants.visible) && 
          product.has_multiple_prices && (
          <div style={getElementStyle(customLayout?.elements.priceVariants, {
            fontSize: '10pt',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginLeft: 'auto'
          })} className="price-variants">
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
