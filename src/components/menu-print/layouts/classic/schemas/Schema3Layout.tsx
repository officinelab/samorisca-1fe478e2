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
  // Schema 3 - Layout espanso con titolo in evidenza e dettagli separati
  return (
    <>
      {/* Titolo principale in evidenza */}
      <div style={getElementStyle(customLayout?.elements.title, {
        fontWeight: 'bold',
        fontSize: '14pt',
        marginBottom: '2mm',
        borderBottom: '1px solid #ccc',
        paddingBottom: '1mm'
      })}>
        {product[`title_${language}`] || product.title}
      </div>
      
      {/* Descrizione se disponibile */}
      {(product[`description_${language}`] || product.description) && (
        <div style={getElementStyle(customLayout?.elements.description, {
          fontSize: '11pt',
          marginBottom: '2mm',
          fontStyle: 'italic'
        })}>
          {product[`description_${language}`] || product.description}
        </div>
      )}
      
      {/* Box con prezzo, allergeni e varianti */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: '2mm',
        borderRadius: '2mm'
      }}>
        {/* Prezzo principale */}
        <div style={getElementStyle(customLayout?.elements.price, {
          fontWeight: 'bold',
          fontSize: '13pt'
        })}>
          € {product.price_standard}
        </div>
        
        {/* Allergeni */}
        {product.allergens && product.allergens.length > 0 && (
          <div style={getElementStyle(customLayout?.elements.allergensList, {
            fontSize: '10pt',
            fontStyle: 'italic'
          })}>
            Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
          </div>
        )}
        
        {/* Varianti di prezzo in fondo */}
        {product.has_multiple_prices && (
          <div style={{
            ...getElementStyle(customLayout?.elements.priceVariants, {
              fontSize: '10pt'
            }),
            width: '100%',
            marginTop: '2mm',
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '2rem',
            borderTop: '1px dotted #ccc',
            paddingTop: '1mm'
          }}>
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
