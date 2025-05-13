
import React from 'react';
import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';

interface ProductItemProps {
  product: Product;
  language: string;
  customLayout?: PrintLayout | null;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, language, customLayout }) => {
  return (
    <div className="menu-item" style={{
      marginBottom: customLayout ? `${customLayout.spacing.betweenProducts}mm` : '5mm',
      breakInside: 'avoid',
      pageBreakInside: 'avoid',
      maxWidth: '100%',
    }}>
      {React.createElement('div', {
        className: 'product-component',
        dangerouslySetInnerHTML: {
          __html: `
            <div style="display: flex; justify-content: space-between; align-items: baseline; width: 100%;">
              <div style="font-weight: bold; font-size: ${customLayout?.elements.title.fontSize || 12}pt; width: auto; margin-right: 10px; max-width: 60%; overflow-wrap: break-word; word-wrap: break-word; word-break: normal;">
                ${product[`title_${language}`] || product.title}
              </div>
              ${product.allergens && product.allergens.length > 0 
                ? `<div style="width: auto; font-size: ${customLayout?.elements.allergensList.fontSize || 10}pt; white-space: nowrap; margin-right: 10px;">
                    ${product.allergens.map(allergen => allergen.number).join(", ")}
                  </div>` 
                : ''}
              <div style="flex-grow: 1; position: relative; top: -3px; border-bottom: 1px dotted #000;"></div>
              <div style="text-align: right; font-weight: bold; width: auto; white-space: nowrap; margin-left: 10px;">
                € ${product.price_standard}
              </div>
            </div>
            ${(product[`description_${language}`] || product.description) 
              ? `<div style="font-size: ${customLayout?.elements.description.fontSize || 10}pt; font-style: italic; margin-top: 2mm; width: 100%; max-width: 95%; overflow-wrap: break-word; word-wrap: break-word; hyphens: auto;">
                  ${product[`description_${language}`] || product.description}
                </div>` 
              : ''}
            ${product.has_multiple_prices 
              ? `<div style="margin-top: 1mm; font-size: ${customLayout?.elements.priceVariants.fontSize || 10}pt; display: flex; justify-content: flex-end; gap: 1rem;">
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
