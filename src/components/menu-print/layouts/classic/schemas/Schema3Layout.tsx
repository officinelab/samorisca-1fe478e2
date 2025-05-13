
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
  // Schema 3 - Layout espanso con titolo, descrizione e poi riquadro per prezzo, allergeni e varianti
  return (
    <>
      {/* Prima riga: Titolo */}
      {(!customLayout || customLayout.elements.title.visible) && (
        <div style={getElementStyle(customLayout?.elements.title, {
          fontWeight: 'bold',
          fontSize: '12pt',
          width: '100%',
          borderBottom: '1px solid #eaeaea',
          paddingBottom: '1mm',
          marginBottom: '1mm'
        })}>
          {product[`title_${language}`] || product.title}
        </div>
      )}
      
      {/* Seconda riga: Descrizione */}
      {(!customLayout || customLayout.elements.description.visible) && 
        (product[`description_${language}`] || product.description) && (
        <div style={getElementStyle(customLayout?.elements.description, {
          fontSize: '10pt',
          fontStyle: 'italic',
          marginBottom: '2mm',
          width: '100%'
        })}>
          {product[`description_${language}`] || product.description}
        </div>
      )}
      
      {/* Riquadro informazioni: Prezzo, Allergeni, Varianti */}
      <div style={{
        backgroundColor: '#f9f9f9',
        border: '1px solid #eaeaea',
        borderRadius: '4px',
        padding: '2mm',
        marginTop: '1mm'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}>
          {/* Prezzo standard */}
          {(!customLayout || customLayout.elements.price.visible) && (
            <div style={getElementStyle(customLayout?.elements.price, {
              fontWeight: 'bold',
              fontSize: '11pt'
            })}>
              € {product.price_standard}
            </div>
          )}
          
          {/* Allergeni */}
          {(!customLayout || customLayout.elements.allergensList.visible) && 
            product.allergens && product.allergens.length > 0 && (
            <div style={getElementStyle(customLayout?.elements.allergensList, {
              fontSize: '9pt'
            })}>
              Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
            </div>
          )}
        </div>
        
        {/* Varianti di prezzo */}
        {(!customLayout || customLayout.elements.priceVariants.visible) && 
          product.has_multiple_prices && (
          <div style={getElementStyle(customLayout?.elements.priceVariants, {
            borderTop: '1px dotted #ccc',
            marginTop: '1mm',
            paddingTop: '1mm',
            fontSize: '9pt',
            display: 'flex',
            gap: '15px'
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
    </>
  );
};

export default Schema3Layout;
