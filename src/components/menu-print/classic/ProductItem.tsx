
import React from 'react';
import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { getElementStyle } from '../utils/styleUtils';

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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        width: '100%'
      }} className="item-header">
        {(!customLayout || customLayout.elements.title.visible) && (
          <div style={getElementStyle(customLayout?.elements.title, {
            fontWeight: 'bold',
            fontSize: '12pt',
            width: 'auto',
            whiteSpace: 'normal',
            marginRight: '10px',
            maxWidth: '60%'
          })} className="item-title">
            {product[`title_${language}`] || product.title}
          </div>
        )}
        
        {(!customLayout || customLayout.elements.allergensList.visible) && 
          product.allergens && product.allergens.length > 0 && (
          <div style={getElementStyle(customLayout?.elements.allergensList, {
            width: 'auto',
            fontSize: '10pt',
            whiteSpace: 'nowrap',
            marginRight: '10px'
          })} className="item-allergens">
            {product.allergens.map(allergen => allergen.number).join(", ")}
          </div>
        )}
        
        <div style={{
          flexGrow: 1,
          position: 'relative',
          top: '-3px',
          borderBottom: '1px dotted #000'
        }} className="item-dots"></div>
        
        {(!customLayout || customLayout.elements.price.visible) && (
          <div style={getElementStyle(customLayout?.elements.price, {
            textAlign: 'right',
            fontWeight: 'bold',
            width: 'auto',
            whiteSpace: 'nowrap',
            marginLeft: '10px'
          })} className="item-price">
            € {product.price_standard}
          </div>
        )}
      </div>
      
      {(!customLayout || customLayout.elements.description.visible) && 
        (product[`description_${language}`] || product.description) && (
        <div style={getElementStyle(customLayout?.elements.description, {
          fontSize: '10pt',
          fontStyle: 'italic',
          marginTop: '2mm',
          width: '100%',
          maxWidth: '95%',
          overflowWrap: 'break-word',
          wordWrap: 'break-word',
          wordBreak: 'normal',
          hyphens: 'auto'
        })} className="item-description">
          {product[`description_${language}`] || product.description}
        </div>
      )}
      
      {(!customLayout || customLayout.elements.priceVariants.visible) && 
        product.has_multiple_prices && (
        <div style={getElementStyle(customLayout?.elements.priceVariants, {
          marginTop: '1mm',
          fontSize: '10pt',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem'
        })}>
          {product.price_variant_1_name && (
            <div>{product.price_variant_1_name}: € {product.price_variant_1_value}</div>
          )}
          {product.price_variant_2_name && (
            <div>{product.price_variant_2_name}: € {product.price_variant_2_value}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductItem;
