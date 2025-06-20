
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Product } from '@/types/database';

interface ProductPricingProps {
  product: Product;
  layout: PrintLayout;
  dimensions: any;
}

const ProductPricing: React.FC<ProductPricingProps> = ({
  product,
  layout,
  dimensions
}) => {
  return (
    <div 
      className="product-price-column"
      style={{ 
        width: '10%',
        textAlign: 'right',
        flexShrink: 0
      }}
    >
      {/* Prezzo principale */}
      {product.price_standard && layout.elements.price?.visible !== false && (
        <div
          className="product-price"
          style={{
            fontSize: `${dimensions.css.priceFontSize}px`,
            fontFamily: layout.elements.price.fontFamily,
            color: layout.elements.price.fontColor,
            fontWeight: layout.elements.price.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: layout.elements.price.fontStyle === 'italic' ? 'italic' : 'normal',
            textAlign: layout.elements.price.alignment as any,
            marginTop: `${dimensions.cssMargins.price.top}px`,
            marginBottom: `${dimensions.cssMargins.price.bottom}px`,
            marginLeft: `${dimensions.cssMargins.price.left}px`,
            marginRight: `${dimensions.cssMargins.price.right}px`,
            lineHeight: 1.5
          }}
        >
          €{product.price_standard.toFixed(2)}
        </div>
      )}

      {/* Suffisso prezzo */}
      {product.has_price_suffix && product.price_suffix && layout.elements.suffix?.visible !== false && (
        <div
          className="product-price-suffix"
          style={{
            fontSize: `${dimensions.css.suffixFontSize}px`,
            fontFamily: layout.elements.suffix.fontFamily,
            color: layout.elements.suffix.fontColor,
            fontWeight: layout.elements.suffix.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: layout.elements.suffix.fontStyle === 'italic' ? 'italic' : 'normal',
            textAlign: layout.elements.suffix.alignment as any,
            lineHeight: 1.5,
            marginTop: '2px'
          }}
        >
          {product.price_suffix}
        </div>
      )}

      {/* Varianti prezzo */}
      {product.has_multiple_prices && layout.elements.priceVariants?.visible !== false && (
        <div
          className="product-price-variants"
          style={{
            marginTop: `${dimensions.cssMargins.variants.top}px`,
            marginBottom: `${dimensions.cssMargins.variants.bottom}px`,
            marginLeft: `${dimensions.cssMargins.variants.left}px`,
            marginRight: `${dimensions.cssMargins.variants.right}px`,
          }}
        >
          {product.price_variant_1_value && product.price_variant_1_name && (
            <div
              style={{
                fontSize: `${dimensions.css.variantsFontSize}px`,
                fontFamily: layout.elements.priceVariants.fontFamily,
                color: layout.elements.priceVariants.fontColor,
                fontWeight: layout.elements.priceVariants.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: layout.elements.priceVariants.fontStyle === 'italic' ? 'italic' : 'normal',
                textAlign: layout.elements.priceVariants.alignment as any,
                lineHeight: 1.5,
                marginBottom: '2px'
              }}
            >
              {product.price_variant_1_name}: €{product.price_variant_1_value.toFixed(2)}
            </div>
          )}
          
          {product.price_variant_2_value && product.price_variant_2_name && (
            <div
              style={{
                fontSize: `${dimensions.css.variantsFontSize}px`,
                fontFamily: layout.elements.priceVariants.fontFamily,
                color: layout.elements.priceVariants.fontColor,
                fontWeight: layout.elements.priceVariants.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: layout.elements.priceVariants.fontStyle === 'italic' ? 'italic' : 'normal',
                textAlign: layout.elements.priceVariants.alignment as any,
                lineHeight: 1.5
              }}
            >
              {product.price_variant_2_name}: €{product.price_variant_2_value.toFixed(2)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductPricing;
