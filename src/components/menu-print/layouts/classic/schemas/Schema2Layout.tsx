
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
      {/* Prima riga: Titolo (80%) e Prezzo (20%) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingBottom: '2mm',
      }}>
        {(!customLayout || customLayout.elements.title.visible) && (
          <div style={getElementStyle(customLayout?.elements.title, {
            fontWeight: 'bold',
            fontSize: '12pt',
            width: '80%', // Occupa l'80% dello spazio disponibile
            marginRight: '10px',
            whiteSpace: 'normal',
          })}>
            {product[`title_${language}`] || product.title}
          </div>
        )}
        
        {(!customLayout || customLayout.elements.price.visible) && (
          <div style={getElementStyle(customLayout?.elements.price, {
            textAlign: 'right',
            fontWeight: 'bold',
            fontSize: '12pt',
            width: '20%', // Occupa il 20% dello spazio disponibile
            whiteSpace: 'nowrap',
          })}>
            € {product.price_standard}
          </div>
        )}
      </div>
      
      {/* Seconda riga: Allergeni/caratteristiche (80%) e Prezzi multipli (20%) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: '1mm',
        marginBottom: '1mm',
      }}>
        <div style={{ width: '80%', display: 'flex', alignItems: 'center' }}>
          {(!customLayout || customLayout.elements.allergensList.visible) && 
            product.allergens && product.allergens.length > 0 && (
            <div style={getElementStyle(customLayout?.elements.allergensList, {
              fontSize: '9pt',
              fontStyle: 'italic',
              marginRight: '5px'
            })}>
              Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
            </div>
          )}
          
          {/* Qui si potrebbero aggiungere le icone delle caratteristiche se disponibili */}
        </div>
        
        {(!customLayout || customLayout.elements.priceVariants.visible) && 
          product.has_multiple_prices && (
          <div style={getElementStyle(customLayout?.elements.priceVariants, {
            fontSize: '9pt',
            width: '20%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            textAlign: 'right',
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
      
      {/* Terza riga: Descrizione (80%) */}
      {(!customLayout || customLayout.elements.description.visible) && 
        (product[`description_${language}`] || product.description) && (
        <div style={getElementStyle(customLayout?.elements.description, {
          fontSize: '10pt',
          fontStyle: 'italic',
          width: '80%',
          maxWidth: '80%'
        })}>
          {product[`description_${language}`] || product.description}
        </div>
      )}
    </>
  );
};

export default Schema2Layout;
