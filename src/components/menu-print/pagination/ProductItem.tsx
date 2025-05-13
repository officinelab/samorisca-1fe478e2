
import React from 'react';
import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { isSchema1Layout } from '@/hooks/menu-layouts/utils/heightCalculator';

interface ProductItemProps {
  product: Product;
  language: string;
  customLayout?: PrintLayout | null;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, language, customLayout }) => {
  // Determina lo schema di layout
  const isSchema1 = customLayout ? isSchema1Layout(customLayout) : false;
  
  // Recupera i valori dal layout o usa i default
  const titleFontSize = customLayout?.elements.title.fontSize || 12;
  const titleFontFamily = customLayout?.elements.title.fontFamily || 'Arial';
  const titleFontStyle = customLayout?.elements.title.fontStyle || 'bold';
  const titleColor = customLayout?.elements.title.fontColor || '#000';
  
  const descFontSize = customLayout?.elements.description.fontSize || 10;
  const descFontFamily = customLayout?.elements.description.fontFamily || 'Arial';
  const descFontStyle = customLayout?.elements.description.fontStyle || 'italic';
  const descColor = customLayout?.elements.description.fontColor || '#000';
  
  const allergensFontSize = customLayout?.elements.allergensList.fontSize || 10;
  const allergensFontFamily = customLayout?.elements.allergensList.fontFamily || 'Arial';
  const allergensColor = customLayout?.elements.allergensList.fontColor || '#000';
  
  const priceFontSize = customLayout?.elements.price.fontSize || 12;
  const priceFontFamily = customLayout?.elements.price.fontFamily || 'Arial';
  const priceFontStyle = customLayout?.elements.price.fontStyle || 'bold';
  const priceColor = customLayout?.elements.price.fontColor || '#000';
  
  const variantsFontSize = customLayout?.elements.priceVariants.fontSize || 10;
  const variantsFontFamily = customLayout?.elements.priceVariants.fontFamily || 'Arial';
  const variantsColor = customLayout?.elements.priceVariants.fontColor || '#000';
  
  // Spazio tra prodotti
  const spacingBetweenProducts = customLayout ? `${customLayout.spacing.betweenProducts}mm` : '5mm';
  
  return (
    <div className="menu-item" style={{ marginBottom: spacingBetweenProducts }}>
      {React.createElement('div', {
        className: 'product-component',
        dangerouslySetInnerHTML: {
          __html: `
            <div style="display: flex; justify-content: space-between; align-items: baseline; width: 100%;">
              <div style="
                font-weight: ${titleFontStyle === 'bold' ? 'bold' : 'normal'}; 
                font-style: ${titleFontStyle === 'italic' ? 'italic' : 'normal'};
                font-size: ${titleFontSize}pt; 
                font-family: ${titleFontFamily};
                color: ${titleColor};
                width: auto; 
                margin-right: 10px; 
                max-width: ${isSchema1 ? '60%' : '90%'};
              ">
                ${product[`title_${language}`] || product.title}
              </div>
              ${isSchema1 && product.allergens && product.allergens.length > 0 
                ? `<div style="
                    width: auto; 
                    font-size: ${allergensFontSize}pt; 
                    font-family: ${allergensFontFamily};
                    color: ${allergensColor};
                    white-space: nowrap; 
                    margin-right: 10px;">
                    ${product.allergens.map(allergen => allergen.number).join(", ")}
                  </div>` 
                : ''}
              ${isSchema1 ? `<div style="flex-grow: 1; position: relative; top: -3px; border-bottom: 1px dotted #000;"></div>` : ''}
              ${isSchema1 ? `<div style="
                text-align: right; 
                font-weight: ${priceFontStyle === 'bold' ? 'bold' : 'normal'}; 
                font-style: ${priceFontStyle === 'italic' ? 'italic' : 'normal'};
                font-size: ${priceFontSize}pt; 
                font-family: ${priceFontFamily};
                color: ${priceColor};
                width: auto; 
                white-space: nowrap; 
                margin-left: 10px;">
                € ${product.price_standard}
              </div>` : ''}
            </div>
            ${!isSchema1 && customLayout?.elements.price.visible ? `
              <div style="
                margin-top: 2mm;
                text-align: right; 
                font-weight: ${priceFontStyle === 'bold' ? 'bold' : 'normal'}; 
                font-style: ${priceFontStyle === 'italic' ? 'italic' : 'normal'};
                font-size: ${priceFontSize}pt; 
                font-family: ${priceFontFamily};
                color: ${priceColor};
              ">
                € ${product.price_standard}
              </div>` : ''}
            ${!isSchema1 && product.allergens && product.allergens.length > 0 && customLayout?.elements.allergensList.visible ? `
              <div style="
                margin-top: 1mm;
                font-size: ${allergensFontSize}pt; 
                font-family: ${allergensFontFamily};
                color: ${allergensColor};
              ">
                ${product.allergens.map(allergen => allergen.number).join(", ")}
              </div>` : ''}
            ${(product[`description_${language}`] || product.description) && customLayout?.elements.description.visible
              ? `<div style="
                  font-size: ${descFontSize}pt; 
                  font-style: ${descFontStyle === 'italic' ? 'italic' : 'normal'};
                  font-weight: ${descFontStyle === 'bold' ? 'bold' : 'normal'};
                  font-family: ${descFontFamily};
                  color: ${descColor};
                  margin-top: 2mm; 
                  width: 100%; 
                  max-width: 95%;">
                  ${product[`description_${language}`] || product.description}
                </div>` 
              : ''}
            ${product.has_multiple_prices && customLayout?.elements.priceVariants.visible
              ? `<div style="
                  margin-top: 1mm; 
                  font-size: ${variantsFontSize}pt; 
                  font-family: ${variantsFontFamily};
                  color: ${variantsColor};
                  display: flex; 
                  justify-content: flex-end; 
                  gap: 1rem;">
                  ${product.price_variant_1_name ? `<div>${product.price_variant_1_name}: € ${product.price_variant_1_value}</div>` : ''}
                  ${product.price_variant_2_name ? `<div>${product.price_variant_2_name}: € ${product.price_variant_2_value}</div>` : ''}
                </div>` 
              : ''}
          `
        }
      })}
    </div>
  );
};

export default ProductItem;
