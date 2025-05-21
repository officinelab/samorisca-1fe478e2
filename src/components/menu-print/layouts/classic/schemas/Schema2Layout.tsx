import React from 'react';
import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { getElementStyle } from '../../../utils/styleUtils';

interface Schema2LayoutProps {
  product: Product;
  language: string;
  customLayout?: PrintLayout | null;
}

const Schema2Layout: React.FC<Schema2LayoutProps> = ({ product, language, customLayout }) => {
  // Schema 2 - Layout compatto con titolo e prezzo affiancati, e descrizione sotto
  return (
    <>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        borderBottom: '1px solid #eee',
        paddingBottom: '2mm',
      }}>
        {/* Titolo e prezzo affiancati */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}>
          <div style={getElementStyle(customLayout?.elements.title, {
            fontWeight: 'bold',
            fontSize: '12pt',
            maxWidth: '70%'
          })}>
            {product[`title_${language}`] || product.title}
          </div>
          
          <div style={getElementStyle(customLayout?.elements.price, {
            textAlign: 'right',
            fontWeight: 'bold',
            fontSize: '12pt'
          })}>
            € {product.price_standard}
          </div>
        </div>
        
        {/* Allergeni e varianti di prezzo sotto */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginTop: '1mm',
        }}>
          {product.allergens && product.allergens.length > 0 && (
            <div style={getElementStyle(customLayout?.elements.allergensList, {
              fontSize: '9pt',
              fontStyle: 'italic',
            })}>
              Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
            </div>
          )}
          
          {product.has_multiple_prices && (
            <div style={getElementStyle(customLayout?.elements.priceVariants, {
              fontSize: '9pt',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px'
            })}>
              {product.price_variant_1_name && (
                <span>{product.price_variant_1_name}: € {product.price_variant_1_value}</span>
              )}
              {product.price_variant_2_name && (
                <span>{product.price_variant_2_name}: € {product.price_variant_2_value}</span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Descrizione sotto */}
      {(product[`description_${language}`] || product.description) && (
        <div style={getElementStyle(customLayout?.elements.description, {
          fontSize: '10pt',
          fontStyle: 'italic',
          marginTop: '1mm',
          width: '100%',
          maxWidth: '95%'
        })}>
          {product[`description_${language}`] || product.description}
        </div>
      )}
    </>
  );
};

export default Schema2Layout;
