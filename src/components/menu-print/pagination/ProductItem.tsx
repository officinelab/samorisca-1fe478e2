
import React from 'react';
import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';

interface ProductItemProps {
  product: Product;
  language: string;
  customLayout?: PrintLayout | null;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, language, customLayout }) => {
  // Determina gli stili in base al layout personalizzato
  const getTitleStyle = () => {
    if (!customLayout || !customLayout.elements.title) {
      return {
        fontWeight: 'bold',
        fontSize: '12pt',
        fontFamily: 'Arial',
        color: '#000',
      };
    }
    
    const element = customLayout.elements.title;
    return {
      fontWeight: element.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: element.fontStyle === 'italic' ? 'italic' : 'normal',
      fontSize: `${element.fontSize}pt`,
      fontFamily: element.fontFamily || 'Arial',
      color: element.fontColor || '#000',
    };
  };
  
  const getDescriptionStyle = () => {
    if (!customLayout || !customLayout.elements.description) {
      return {
        fontStyle: 'italic',
        fontSize: '10pt',
        fontFamily: 'Arial',
        color: '#333',
        marginTop: '2mm',
      };
    }
    
    const element = customLayout.elements.description;
    return {
      fontWeight: element.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: element.fontStyle === 'italic' ? 'italic' : 'normal',
      fontSize: `${element.fontSize}pt`,
      fontFamily: element.fontFamily || 'Arial',
      color: element.fontColor || '#333',
      marginTop: '2mm',
    };
  };
  
  const getAllergensStyle = () => {
    if (!customLayout || !customLayout.elements.allergensList) {
      return {
        fontSize: '10pt',
        fontFamily: 'Arial',
        color: '#666',
      };
    }
    
    const element = customLayout.elements.allergensList;
    return {
      fontWeight: element.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: element.fontStyle === 'italic' ? 'italic' : 'normal',
      fontSize: `${element.fontSize}pt`,
      fontFamily: element.fontFamily || 'Arial',
      color: element.fontColor || '#666',
    };
  };
  
  const getPriceStyle = () => {
    if (!customLayout || !customLayout.elements.price) {
      return {
        fontWeight: 'bold',
        fontSize: '12pt',
        fontFamily: 'Arial',
        color: '#000',
      };
    }
    
    const element = customLayout.elements.price;
    return {
      fontWeight: element.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: element.fontStyle === 'italic' ? 'italic' : 'normal',
      fontSize: `${element.fontSize}pt`,
      fontFamily: element.fontFamily || 'Arial',
      color: element.fontColor || '#000',
    };
  };
  
  const getVariantStyle = () => {
    if (!customLayout || !customLayout.elements.priceVariants) {
      return {
        fontSize: '10pt',
        fontFamily: 'Arial',
        color: '#333',
      };
    }
    
    const element = customLayout.elements.priceVariants;
    return {
      fontWeight: element.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: element.fontStyle === 'italic' ? 'italic' : 'normal',
      fontSize: `${element.fontSize}pt`,
      fontFamily: element.fontFamily || 'Arial',
      color: element.fontColor || '#333',
    };
  };
  
  return (
    <div 
      className="menu-item"
      style={{
        marginBottom: customLayout ? `${customLayout.spacing.betweenProducts}mm` : '5mm',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'baseline', 
        width: '100%' 
      }}>
        {customLayout?.elements.title.visible !== false && (
          <div style={{ 
            ...getTitleStyle(),
            width: 'auto',
            marginRight: '10px',
            maxWidth: '60%',
            overflowWrap: 'break-word',
            wordWrap: 'break-word'
          }}>
            {product[`title_${language}`] || product.title}
          </div>
        )}
        
        {customLayout?.elements.allergensList.visible !== false && 
         product.allergens && product.allergens.length > 0 && (
          <div style={{ 
            ...getAllergensStyle(),
            width: 'auto',
            whiteSpace: 'nowrap',
            marginRight: '10px'
          }}>
            {product.allergens.map(allergen => allergen.number).join(", ")}
          </div>
        )}
        
        <div style={{ 
          flexGrow: 1, 
          position: 'relative', 
          top: '-3px', 
          borderBottom: '1px dotted #000'
        }}></div>
        
        {customLayout?.elements.price.visible !== false && (
          <div style={{ 
            ...getPriceStyle(),
            width: 'auto',
            whiteSpace: 'nowrap',
            marginLeft: '10px',
            textAlign: 'right'
          }}>
            € {product.price_standard}
          </div>
        )}
      </div>
      
      {customLayout?.elements.description.visible !== false && 
       (product[`description_${language}`] || product.description) && (
        <div style={{ 
          ...getDescriptionStyle(),
          maxWidth: '95%',
          width: '100%',
          overflowWrap: 'break-word',
          wordWrap: 'break-word'
        }}>
          {product[`description_${language}`] || product.description}
        </div>
      )}
      
      {customLayout?.elements.priceVariants.visible !== false && 
       product.has_multiple_prices && (
        <div style={{ 
          marginTop: '1mm', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '1rem'
        }}>
          {product.price_variant_1_name && (
            <div style={getVariantStyle()}>
              {product.price_variant_1_name}: € {product.price_variant_1_value}
            </div>
          )}
          
          {product.price_variant_2_name && (
            <div style={getVariantStyle()}>
              {product.price_variant_2_name}: € {product.price_variant_2_value}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductItem;
