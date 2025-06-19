
import React from 'react';
import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';

interface ProductRendererProps {
  product: Product;
  layout: PrintLayout;
  isLast: boolean;
}

const ProductRenderer: React.FC<ProductRendererProps> = ({
  product,
  layout,
  isLast
}) => {
  const elementsConfig = layout.elements;

  // Get allergens numbers if available
  const allergenNumbers = product.allergens?.map(allergen => allergen.number).join(', ') || '';

  // Format price with suffix
  const formatPrice = () => {
    if (!product.price_standard) return '';
    let price = `€${product.price_standard.toFixed(2)}`;
    if (product.has_price_suffix && product.price_suffix) {
      price += ` ${product.price_suffix}`;
    }
    return price;
  };

  return (
    <div 
      className="product-item"
      style={{
        marginBottom: !isLast ? `${layout.spacing.betweenProducts}mm` : '0'
      }}
    >
      {/* Schema 1: Two column layout (90% + 10%) */}
      <div className="flex items-start gap-2">
        {/* Left column: Product details (90%) */}
        <div className="flex-1" style={{ width: '90%' }}>
          {/* Product Title */}
          <div
            className="product-title"
            style={{
              fontSize: `${elementsConfig.title.fontSize}pt`,
              fontFamily: elementsConfig.title.fontFamily,
              color: elementsConfig.title.fontColor,
              fontWeight: elementsConfig.title.fontStyle === 'bold' ? 'bold' : 'normal',
              fontStyle: elementsConfig.title.fontStyle === 'italic' ? 'italic' : 'normal',
              textAlign: elementsConfig.title.alignment as any,
              marginTop: `${elementsConfig.title.margin.top}mm`,
              marginRight: `${elementsConfig.title.margin.right}mm`,
              marginBottom: `${elementsConfig.title.margin.bottom}mm`,
              marginLeft: `${elementsConfig.title.margin.left}mm`,
            }}
          >
            {product.title}
          </div>

          {/* Product Description */}
          {product.description && (
            <div
              className="product-description"
              style={{
                fontSize: `${elementsConfig.description.fontSize}pt`,
                fontFamily: elementsConfig.description.fontFamily,
                color: elementsConfig.description.fontColor,
                fontWeight: elementsConfig.description.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: elementsConfig.description.fontStyle === 'italic' ? 'italic' : 'normal',
                textAlign: elementsConfig.description.alignment as any,
                marginTop: `${elementsConfig.description.margin.top}mm`,
                marginRight: `${elementsConfig.description.margin.right}mm`,
                marginBottom: `${elementsConfig.description.margin.bottom}mm`,
                marginLeft: `${elementsConfig.description.margin.left}mm`,
              }}
            >
              {product.description}
            </div>
          )}

          {/* English Description - would need to fetch from translations table */}
          {/* TODO: Implement English description rendering */}

          {/* Allergens */}
          {allergenNumbers && (
            <div
              className="product-allergens"
              style={{
                fontSize: `${elementsConfig.allergensList.fontSize}pt`,
                fontFamily: elementsConfig.allergensList.fontFamily,
                color: elementsConfig.allergensList.fontColor,
                fontWeight: elementsConfig.allergensList.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: elementsConfig.allergensList.fontStyle === 'italic' ? 'italic' : 'normal',
                textAlign: elementsConfig.allergensList.alignment as any,
                marginTop: `${elementsConfig.allergensList.margin.top}mm`,
                marginRight: `${elementsConfig.allergensList.margin.right}mm`,
                marginBottom: `${elementsConfig.allergensList.margin.bottom}mm`,
                marginLeft: `${elementsConfig.allergensList.margin.left}mm`,
              }}
            >
              Allergeni: {allergenNumbers}
            </div>
          )}

          {/* Product Features */}
          {product.features && product.features.length > 0 && (
            <div
              className="product-features flex items-center gap-1"
              style={{
                marginTop: `${elementsConfig.productFeatures.marginTop}mm`,
                marginBottom: `${elementsConfig.productFeatures.marginBottom}mm`,
              }}
            >
              {product.features.map((feature, index) => (
                <React.Fragment key={feature.id}>
                  {feature.icon_url && (
                    <img
                      src={feature.icon_url}
                      alt={feature.title}
                      title={feature.title}
                      style={{
                        width: `${elementsConfig.productFeatures.iconSize}px`,
                        height: `${elementsConfig.productFeatures.iconSize}px`,
                      }}
                    />
                  )}
                  {index < product.features.length - 1 && (
                    <div style={{ width: `${elementsConfig.productFeatures.iconSpacing}px` }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Price Variants */}
          {product.has_multiple_prices && (product.price_variant_1_name || product.price_variant_2_name) && (
            <div
              className="price-variants"
              style={{
                fontSize: `${elementsConfig.priceVariants.fontSize}pt`,
                fontFamily: elementsConfig.priceVariants.fontFamily,
                color: elementsConfig.priceVariants.fontColor,
                fontWeight: elementsConfig.priceVariants.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: elementsConfig.priceVariants.fontStyle === 'italic' ? 'italic' : 'normal',
                textAlign: elementsConfig.priceVariants.alignment as any,
                marginTop: `${elementsConfig.priceVariants.margin.top}mm`,
                marginRight: `${elementsConfig.priceVariants.margin.right}mm`,
                marginBottom: `${elementsConfig.priceVariants.margin.bottom}mm`,
                marginLeft: `${elementsConfig.priceVariants.margin.left}mm`,
              }}
            >
              {product.price_variant_1_name && (
                <span>{product.price_variant_1_name}: €{product.price_variant_1_value?.toFixed(2)}</span>
              )}
              {product.price_variant_1_name && product.price_variant_2_name && <span> • </span>}
              {product.price_variant_2_name && (
                <span>{product.price_variant_2_name}: €{product.price_variant_2_value?.toFixed(2)}</span>
              )}
            </div>
          )}
        </div>

        {/* Right column: Price (10%) */}
        <div className="flex-shrink-0" style={{ width: '10%' }}>
          {product.price_standard && (
            <div
              className="product-price"
              style={{
                fontSize: `${elementsConfig.price.fontSize}pt`,
                fontFamily: elementsConfig.price.fontFamily,
                color: elementsConfig.price.fontColor,
                fontWeight: elementsConfig.price.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: elementsConfig.price.fontStyle === 'italic' ? 'italic' : 'normal',
                textAlign: elementsConfig.price.alignment as any,
                marginTop: `${elementsConfig.price.margin.top}mm`,
                marginRight: `${elementsConfig.price.margin.right}mm`,
                marginBottom: `${elementsConfig.price.margin.bottom}mm`,
                marginLeft: `${elementsConfig.price.margin.left}mm`,
              }}
            >
              {formatPrice()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductRenderer;
