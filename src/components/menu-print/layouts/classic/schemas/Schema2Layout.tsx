
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
  return (
    <>
      {/* Riga 1: Titolo e prezzo */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingBottom: '1mm',
        borderBottom: '1px solid #eee',
      }}>
        {(!customLayout || customLayout.elements.title.visible) && (
          <div style={getElementStyle(customLayout?.elements.title, {
            maxWidth: '80%',
            flexGrow: 1,
            paddingRight: '5mm',
            fontWeight: 'bold',
            fontSize: '12pt',
          })}>
            {product[`title_${language}`] || product.title}
          </div>
        )}
        
        {(!customLayout || customLayout.elements.price.visible) && (
          <div style={getElementStyle(customLayout?.elements.price, {
            textAlign: 'right',
            width: '20%',
            fontWeight: 'bold',
            fontSize: '12pt',
          })}>
            € {product.price_standard}
          </div>
        )}
      </div>
      
      {/* Riga 2: Allergeni e varianti di prezzo */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
        marginTop: '1mm',
      }}>
        <div style={{ maxWidth: '80%' }}>
          {(!customLayout || customLayout.elements.allergensList.visible) && 
            (product.allergens || product.features) && (
            <div style={getElementStyle(customLayout?.elements.allergensList, {
              fontSize: '10pt',
              fontStyle: 'italic',
            })}>
              {product.allergens && product.allergens.length > 0 && (
                <span>Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}</span>
              )}
              {product.features && product.features.length > 0 && (
                <span style={{ marginLeft: product.allergens?.length ? '4px' : '0', display: 'inline-flex', verticalAlign: 'middle' }}>
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
        
        <div style={{ width: '20%', textAlign: 'right' }}>
          {(!customLayout || customLayout.elements.priceVariants.visible) && 
            product.has_multiple_prices && (
            <div style={getElementStyle(customLayout?.elements.priceVariants, {
              fontSize: '10pt',
              textAlign: 'right',
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
      
      {/* Riga 3: Descrizione */}
      {(!customLayout || customLayout.elements.description.visible) && 
        (product[`description_${language}`] || product.description) && (
        <div style={getElementStyle(customLayout?.elements.description, {
          marginTop: '1mm',
          maxWidth: '80%',
          fontSize: '10pt',
          fontStyle: 'italic',
        })}>
          {product[`description_${language}`] || product.description}
        </div>
      )}
    </>
  );
};

export default Schema2Layout;
