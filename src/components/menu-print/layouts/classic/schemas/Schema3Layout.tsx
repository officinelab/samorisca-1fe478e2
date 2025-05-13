
import React from 'react';
import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { getElementStyle } from '../../../utils/styleUtils';

interface Schema3LayoutProps {
  product: Product;
  language: string;
  customLayout?: PrintLayout | null;
}

const Schema3Layout: React.FC<Schema3LayoutProps> = ({ product, language, customLayout }) => {
  return (
    <div style={{
      padding: '2mm',
      border: '1px solid #eee',
      borderRadius: '2mm'
    }}>
      {/* Titolo */}
      {(!customLayout || customLayout.elements.title.visible) && (
        <div style={getElementStyle(customLayout?.elements.title, {
          fontWeight: 'bold',
          fontSize: '12pt',
        })}>
          {product[`title_${language}`] || product.title}
        </div>
      )}
      
      {/* Descrizione */}
      {(!customLayout || customLayout.elements.description.visible) && 
        (product[`description_${language}`] || product.description) && (
        <div style={getElementStyle(customLayout?.elements.description, {
          margin: '1mm 0',
          fontSize: '10pt',
          fontStyle: 'italic',
        })}>
          {product[`description_${language}`] || product.description}
        </div>
      )}
      
      {/* Footer con prezzo, allergeni e varianti */}
      <div style={{
        marginTop: '2mm',
        padding: '1mm',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'column',
        gap: '1mm'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          {/* Prezzo */}
          {(!customLayout || customLayout.elements.price.visible) && (
            <div style={getElementStyle(customLayout?.elements.price, {
              fontWeight: 'bold',
              fontSize: '12pt',
            })}>
              € {product.price_standard}
            </div>
          )}
          
          {/* Allergeni */}
          {(!customLayout || customLayout.elements.allergensList.visible) && 
            product.allergens && product.allergens.length > 0 && (
            <div style={getElementStyle(customLayout?.elements.allergensList, {
              fontSize: '10pt',
            })}>
              Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
              {product.features && product.features.length > 0 && (
                <span style={{ marginLeft: '4px', display: 'inline-flex', verticalAlign: 'middle' }}>
                  {product.features.map((feature, index) => (
                    <img 
                      key={index}
                      src={feature.icon_url || ''}
                      alt={feature.title}
                      title={feature.title}
                      style={{ height: '12px', width: 'auto', marginLeft: '2px', display: 'inline' }}
                    />
                  ))}
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Varianti di prezzo */}
        {(!customLayout || customLayout.elements.priceVariants.visible) && 
          product.has_multiple_prices && (
          <div style={getElementStyle(customLayout?.elements.priceVariants, {
            borderTop: '1px dotted #ddd',
            paddingTop: '1mm',
            display: 'flex',
            gap: '10px',
            fontSize: '10pt',
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
    </div>
  );
};

export default Schema3Layout;
