
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
  // Schema 2 - Layout compatto con titolo e prezzo affiancati, 
  // allergeni e caratteristiche a sinistra, varianti di prezzo a destra,
  // descrizione sotto
  return (
    <>
      {/* Prima riga: Titolo (80%) e prezzo (20%) affiancati */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: '1mm',
        paddingBottom: '1mm',
        borderBottom: '1px solid #eee',
      }}>
        {(!customLayout || customLayout.elements.title.visible) && (
          <div style={getElementStyle(customLayout?.elements.title, {
            fontWeight: 'bold',
            fontSize: '12pt',
            maxWidth: '80%',
            flexGrow: 1,
            paddingRight: '5mm'
          })}>
            {product[`title_${language}`] || product.title}
          </div>
        )}
        
        {(!customLayout || customLayout.elements.price.visible) && (
          <div style={getElementStyle(customLayout?.elements.price, {
            textAlign: 'right',
            fontWeight: 'bold',
            fontSize: '12pt',
            whiteSpace: 'nowrap',
            width: '20%'
          })}>
            € {product.price_standard}
          </div>
        )}
      </div>
      
      {/* Seconda riga: allergeni a sinistra, varianti di prezzo a destra */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: '1mm',
      }}>
        <div style={{ maxWidth: '80%', flexGrow: 1 }}>
          {(!customLayout || customLayout.elements.allergensList.visible) && 
            product.allergens && product.allergens.length > 0 && (
            <div style={getElementStyle(customLayout?.elements.allergensList, {
              fontSize: '9pt',
              fontStyle: 'italic',
            })}>
              Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
              {product.features && product.features.length > 0 && (
                <span className="ml-2">
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
              fontSize: '9pt',
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
      
      {/* Terza riga: descrizione (80% larghezza) */}
      {(!customLayout || customLayout.elements.description.visible) && 
        (product[`description_${language}`] || product.description) && (
        <div style={getElementStyle(customLayout?.elements.description, {
          fontSize: '10pt',
          fontStyle: 'italic',
          width: '100%',
          maxWidth: '80%'
        })}>
          {product[`description_${language}`] || product.description}
        </div>
      )}
    </>
  );
};

export default Schema2Layout;
