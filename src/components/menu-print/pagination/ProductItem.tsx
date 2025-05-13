
import React from 'react';
import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';

interface ProductItemProps {
  product: Product;
  language: string;
  customLayout?: PrintLayout | null;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, language, customLayout }) => {
  // Assicuriamo che il prodotto venga renderizzato correttamente
  // con le proprietà di interruzione di pagina
  return (
    <div 
      className="menu-item" 
      style={{
        marginBottom: customLayout ? `${customLayout.spacing.betweenProducts}mm` : '5mm',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        wordBreak: 'break-word', // Garantisce che il testo vada a capo invece di fuoriuscire
        overflowWrap: 'break-word',
        maxWidth: '100%'
      }}
    >
      {/* Header con titolo, allergeni e prezzo */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        width: '100%',
        flexWrap: 'wrap' // Permette il wrapping se lo spazio è insufficiente
      }}>
        {/* Titolo del prodotto */}
        {(!customLayout || customLayout.elements.title.visible !== false) && (
          <div style={{
            fontFamily: customLayout?.elements.title.fontFamily || 'Arial',
            fontSize: `${customLayout?.elements.title.fontSize || 12}pt`,
            color: customLayout?.elements.title.fontColor || '#000',
            fontWeight: customLayout?.elements.title.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: customLayout?.elements.title.fontStyle === 'italic' ? 'italic' : 'normal',
            marginRight: '10px',
            maxWidth: '60%', // Limita la larghezza del titolo
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}>
            {product[`title_${language}`] || product.title}
          </div>
        )}
        
        {/* Allergeni */}
        {(!customLayout || customLayout.elements.allergensList.visible !== false) && 
          product.allergens && product.allergens.length > 0 && (
          <div style={{
            fontFamily: customLayout?.elements.allergensList.fontFamily || 'Arial',
            fontSize: `${customLayout?.elements.allergensList.fontSize || 10}pt`,
            color: customLayout?.elements.allergensList.fontColor || '#666',
            fontWeight: customLayout?.elements.allergensList.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: customLayout?.elements.allergensList.fontStyle === 'italic' ? 'italic' : 'normal',
            marginRight: '10px',
            whiteSpace: 'nowrap'
          }}>
            {product.allergens.map(allergen => allergen.number).join(", ")}
          </div>
        )}
        
        {/* Linea punteggiata */}
        <div style={{
          flexGrow: 1,
          position: 'relative',
          top: '-3px',
          borderBottom: '1px dotted #000',
          minWidth: '20px' // Garantisce una linea punteggiata minima
        }}></div>
        
        {/* Prezzo */}
        {(!customLayout || customLayout.elements.price.visible !== false) && (
          <div style={{
            fontFamily: customLayout?.elements.price.fontFamily || 'Arial',
            fontSize: `${customLayout?.elements.price.fontSize || 12}pt`,
            color: customLayout?.elements.price.fontColor || '#000',
            fontWeight: customLayout?.elements.price.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: customLayout?.elements.price.fontStyle === 'italic' ? 'italic' : 'normal',
            marginLeft: '10px',
            whiteSpace: 'nowrap'
          }}>
            € {product.price_standard}
          </div>
        )}
      </div>
      
      {/* Descrizione */}
      {(!customLayout || customLayout.elements.description.visible !== false) && 
        (product[`description_${language}`] || product.description) && (
        <div style={{
          fontFamily: customLayout?.elements.description.fontFamily || 'Arial',
          fontSize: `${customLayout?.elements.description.fontSize || 10}pt`,
          color: customLayout?.elements.description.fontColor || '#666',
          fontWeight: customLayout?.elements.description.fontStyle === 'bold' ? 'bold' : 'normal',
          fontStyle: customLayout?.elements.description.fontStyle === 'italic' ? 'italic' : 'normal',
          marginTop: '2mm',
          width: '100%',
          maxWidth: '95%',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto' // Abilita la sillabazione automatica
        }}>
          {product[`description_${language}`] || product.description}
        </div>
      )}
      
      {/* Varianti di prezzo */}
      {(!customLayout || customLayout.elements.priceVariants.visible !== false) && 
        product.has_multiple_prices && (
        <div style={{
          fontFamily: customLayout?.elements.priceVariants.fontFamily || 'Arial',
          fontSize: `${customLayout?.elements.priceVariants.fontSize || 10}pt`,
          color: customLayout?.elements.priceVariants.fontColor || '#000',
          fontWeight: customLayout?.elements.priceVariants.fontStyle === 'bold' ? 'bold' : 'normal',
          fontStyle: customLayout?.elements.priceVariants.fontStyle === 'italic' ? 'italic' : 'normal',
          display: 'flex',
          flexWrap: 'wrap', // Permette il wrapping se necessario
          justifyContent: 'flex-end',
          gap: '1rem',
          marginTop: '1mm'
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
  );
};

export default ProductItem;
