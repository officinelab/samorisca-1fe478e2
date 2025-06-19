
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

  // Get allergens numbers if available - FIXED: correct condition
  const allergenNumbers = product.allergens && product.allergens.length > 0 
    ? product.allergens.map(allergen => allergen.number).join(', ') 
    : '';

  // Check if we should show English description
  const shouldShowEnglishDescription = () => {
    if (!product.description_en) return false;
    if (product.description_en === product.description) return false;
    // Check if descriptionEng is visible (default to true if not specified)
    return elementsConfig.descriptionEng?.visible !== false;
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

          {/* Product Description (Italian) */}
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

          {/* English Description */}
          {shouldShowEnglishDescription() && (
            <div
              className="product-description-eng"
              style={{
                fontSize: `${elementsConfig.descriptionEng.fontSize}pt`,
                fontFamily: elementsConfig.descriptionEng.fontFamily,
                color: elementsConfig.descriptionEng.fontColor,
                fontWeight: elementsConfig.descriptionEng.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: elementsConfig.descriptionEng.fontStyle === 'italic' ? 'italic' : 'normal',
                textAlign: elementsConfig.descriptionEng.alignment as any,
                marginTop: `${elementsConfig.descriptionEng.margin.top}mm`,
                marginRight: `${elementsConfig.descriptionEng.margin.right}mm`,
                marginBottom: `${elementsConfig.descriptionEng.margin.bottom}mm`,
                marginLeft: `${elementsConfig.descriptionEng.margin.left}mm`,
              }}
            >
              {product.description_en}
            </div>
          )}

          {/* Allergens - FIXED: Show only when allergens exist */}
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
              className="product-features flex items-center"
              style={{
                marginTop: `${layout.productFeatures?.icon?.marginTop || 0}mm`,
                marginBottom: `${layout.productFeatures?.icon?.marginBottom || 0}mm`,
                gap: `${layout.productFeatures?.icon?.iconSpacing || 4}px`
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
                        width: `${layout.productFeatures?.icon?.iconSize || 16}px`,
                        height: `${layout.productFeatures?.icon?.iconSize || 16}px`,
                      }}
                    />
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
        <div className="flex-shrink-0 flex flex-col" style={{ width: '10%' }}>
          {/* Prima riga - Prezzo principale */}
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
              €{product.price_standard.toFixed(2)}
            </div>
          )}

          {/* Seconda riga - Suffisso prezzo (se presente) */}
          {product.has_price_suffix && product.price_suffix && (
            <div
              className="product-price-suffix"
              style={{
                fontSize: `${elementsConfig.suffix.fontSize}pt`,
                fontFamily: elementsConfig.suffix.fontFamily,
                color: elementsConfig.suffix.fontColor,
                fontWeight: elementsConfig.suffix.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: elementsConfig.suffix.fontStyle === 'italic' ? 'italic' : 'normal',
                textAlign: elementsConfig.suffix.alignment as any,
              }}
            >
              {product.price_suffix}
            </div>
          )}

          {/* Righe successive - Varianti prezzo (se presenti) */}
          {product.has_multiple_prices && product.price_variant_1_value && (
            <div
              className="product-price-variant"
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
              €{product.price_variant_1_value.toFixed(2)}
            </div>
          )}

          {/* Nome variante 1 */}
          {product.has_multiple_prices && product.price_variant_1_name && (
            <div
              className="product-price-variant-name"
              style={{
                fontSize: `${elementsConfig.suffix.fontSize}pt`,
                fontFamily: elementsConfig.suffix.fontFamily,
                color: elementsConfig.suffix.fontColor,
                fontWeight: elementsConfig.suffix.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: elementsConfig.suffix.fontStyle === 'italic' ? 'italic' : 'normal',
                textAlign: elementsConfig.suffix.alignment as any,
              }}
            >
              {product.price_variant_1_name}
            </div>
          )}

          {/* Variante 2 prezzo */}
          {product.has_multiple_prices && product.price_variant_2_value && (
            <div
              className="product-price-variant-2"
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
              €{product.price_variant_2_value.toFixed(2)}
            </div>
          )}

          {/* Nome variante 2 */}
          {product.has_multiple_prices && product.price_variant_2_name && (
            <div
              className="product-price-variant-2-name"
              style={{
                fontSize: `${elementsConfig.suffix.fontSize}pt`,
                fontFamily: elementsConfig.suffix.fontFamily,
                color: elementsConfig.suffix.fontColor,
                fontWeight: elementsConfig.suffix.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: elementsConfig.suffix.fontStyle === 'italic' ? 'italic' : 'normal',
                textAlign: elementsConfig.suffix.alignment as any,
              }}
            >
              {product.price_variant_2_name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductRenderer;
