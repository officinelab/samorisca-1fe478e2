
import React from 'react';
import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { getElementStyle } from '../../../utils/styleUtils';

interface Schema1LayoutProps {
  product: Product;
  language: string;
  customLayout?: PrintLayout | null;
}

const Schema1Layout: React.FC<Schema1LayoutProps> = ({ product, language, customLayout }) => {
  return (
    <div style={{
      display: 'flex',
      width: '100%',
      gap: '8px'
    }}>
      {/* Prima colonna - 90% */}
      <div style={{ width: '90%' }}>
        {/* Prima riga - Titolo del prodotto */}
        <div style={getElementStyle(customLayout?.elements.title, {
          fontWeight: 'bold',
          fontSize: '12pt',
          marginBottom: '1mm'
        })}>
          {product[`title_${language}`] || product.title}
        </div>
        
        {/* Seconda riga - Descrizione in italiano */}
        {(product.description) && (
          <div style={getElementStyle(customLayout?.elements.description, {
            fontSize: '10pt',
            fontStyle: 'italic',
            marginBottom: '1mm'
          })}>
            {product.description}
          </div>
        )}
        
        {/* Terza riga - Traduzione descrizione in inglese (se presente) */}
        {(product[`description_${language}`] && language !== 'it' && product[`description_${language}`] !== product.description) && (
          <div style={getElementStyle(customLayout?.elements.descriptionEng, {
            fontSize: '10pt',
            fontStyle: 'italic',
            marginBottom: '1mm'
          })}>
            {product[`description_${language}`]}
          </div>
        )}
        
        {/* Quarta riga - Elenco allergeni */}
        {product.allergens && product.allergens.length > 0 && (
          <div style={getElementStyle(customLayout?.elements.allergensList, {
            fontSize: '9pt',
            marginBottom: '1mm'
          })}>
            Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
          </div>
        )}
        
        {/* Quinta riga - Icone caratteristiche del prodotto */}
        {product.features && product.features.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
            marginBottom: '1mm'
          }}>
            {product.features.map((feature) => (
              <div key={feature.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                {feature.icon_url && (
                  <img 
                    src={feature.icon_url} 
                    alt={feature.displayTitle || feature.title}
                    style={{
                      width: `${customLayout?.elements.productFeatures.iconSize || 16}px`,
                      height: `${customLayout?.elements.productFeatures.iconSize || 16}px`
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Seconda colonna - 10% */}
      <div style={{ 
        width: '10%',
        textAlign: 'right',
        display: 'flex',
        flexDirection: 'column',
        gap: '1mm'
      }}>
        {/* Prima riga - Prezzo standard */}
        <div style={getElementStyle(customLayout?.elements.price, {
          fontWeight: 'bold',
          fontSize: '12pt'
        })}>
          € {product.price_standard}
        </div>
        
        {/* Seconda riga - Suffisso prezzo */}
        {product.has_price_suffix && product.price_suffix && (
          <div style={{
            fontSize: '9pt',
            fontStyle: 'italic'
          }}>
            {product.price_suffix}
          </div>
        )}
        
        {/* Terza riga - Prezzo Variante 1 (se presente) */}
        {product.has_multiple_prices && product.price_variant_1_value && (
          <div style={getElementStyle(customLayout?.elements.priceVariants, {
            fontSize: '10pt'
          })}>
            € {product.price_variant_1_value}
          </div>
        )}
        
        {/* Quarta riga - Nome prezzo variante 1 (se presente) */}
        {product.has_multiple_prices && product.price_variant_1_name && (
          <div style={{
            fontSize: '9pt',
            fontStyle: 'italic'
          }}>
            {product.price_variant_1_name}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schema1Layout;
