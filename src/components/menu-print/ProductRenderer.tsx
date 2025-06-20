
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Product } from '@/types/database';
import { getStandardizedDimensions } from '@/hooks/print/pdf/utils/conversionUtils';

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
  const dimensions = getStandardizedDimensions(layout);
  
  console.log('🎨 ProductRenderer - Rendering con Schema 1 (90%/10%):', product.title, {
    titleFontSize: dimensions.css.titleFontSize,
    descriptionFontSize: dimensions.css.descriptionFontSize,
    iconSize: dimensions.icons.cssSizePx,
    productSpacing: dimensions.spacing.betweenProducts
  });

  // ✅ SCHEMA 1: Due colonne 90% contenuto, 10% prezzo (come da template)
  const contentWidth = '90%';  // ✅ Corretto per Schema 1
  const priceWidth = '10%';   // ✅ Corretto per Schema 1

  // Verifica se mostrare descrizione inglese
  const shouldShowEnglishDescription = product.description_en && 
    product.description_en !== product.description;

  return (
    <div 
      className="product-item flex justify-between items-start w-full"
      style={{
        marginBottom: !isLast ? `${dimensions.spacing.betweenProducts}mm` : '0',
        minHeight: 'auto'
      }}
    >
      {/* Colonna contenuto - 90% (Schema 1) */}
      <div 
        className="product-content flex-1"
        style={{ width: contentWidth, paddingRight: '3mm' }}
      >
        {/* Titolo prodotto */}
        <div
          className="product-title"
          style={{
            fontSize: `${dimensions.css.titleFontSize}px`,
            fontFamily: layout.elements.title.fontFamily,
            color: layout.elements.title.fontColor,
            fontWeight: layout.elements.title.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: layout.elements.title.fontStyle === 'italic' ? 'italic' : 'normal',
            textAlign: layout.elements.title.alignment as any,
            marginTop: `${dimensions.cssMargins.title.top}px`,
            marginBottom: `${dimensions.cssMargins.title.bottom}px`,
            marginLeft: `${dimensions.cssMargins.title.left}px`,
            marginRight: `${dimensions.cssMargins.title.right}px`,
            lineHeight: 1.3
          }}
        >
          {product.title}
        </div>

        {/* Descrizione italiana */}
        {product.description && layout.elements.description?.visible !== false && (
          <div
            className="product-description"
            style={{
              fontSize: `${dimensions.css.descriptionFontSize}px`,
              fontFamily: layout.elements.description.fontFamily,
              color: layout.elements.description.fontColor,
              fontWeight: layout.elements.description.fontStyle === 'bold' ? 'bold' : 'normal',
              fontStyle: layout.elements.description.fontStyle === 'italic' ? 'italic' : 'normal',
              textAlign: layout.elements.description.alignment as any,
              marginTop: `${dimensions.cssMargins.description.top}px`,
              marginBottom: `${dimensions.cssMargins.description.bottom}px`,
              marginLeft: `${dimensions.cssMargins.description.left}px`,
              marginRight: `${dimensions.cssMargins.description.right}px`,
              lineHeight: 1.4
            }}
          >
            {product.description}
          </div>
        )}

        {/* Descrizione inglese */}
        {shouldShowEnglishDescription && layout.elements.descriptionEng?.visible !== false && (
          <div
            className="product-description-eng"
            style={{
              fontSize: `${dimensions.css.descriptionEngFontSize}px`,
              fontFamily: layout.elements.descriptionEng.fontFamily,
              color: layout.elements.descriptionEng.fontColor,
              fontWeight: layout.elements.descriptionEng.fontStyle === 'bold' ? 'bold' : 'normal',
              fontStyle: layout.elements.descriptionEng.fontStyle === 'italic' ? 'italic' : 'normal',
              textAlign: layout.elements.descriptionEng.alignment as any,
              marginTop: `${dimensions.cssMargins.descriptionEng.top}px`,
              marginBottom: `${dimensions.cssMargins.descriptionEng.bottom}px`,
              marginLeft: `${dimensions.cssMargins.descriptionEng.left}px`,
              marginRight: `${dimensions.cssMargins.descriptionEng.right}px`,
              lineHeight: 1.4
            }}
          >
            {product.description_en}
          </div>
        )}

        {/* NUOVA RIGA COMBINATA: Allergeni + Icone caratteristiche */}
        {((product.allergens && product.allergens.length > 0) || (product.features && product.features.length > 0)) && (
          <div
            className="allergens-and-features flex items-center gap-3"
            style={{
              marginTop: `${dimensions.cssMargins.allergens.top}px`,
              marginBottom: `${dimensions.cssMargins.allergens.bottom}px`,
              marginLeft: `${dimensions.cssMargins.allergens.left}px`,
              marginRight: `${dimensions.cssMargins.allergens.right}px`,
              flexWrap: 'wrap'
            }}
          >
            {/* Lista allergeni */}
            {product.allergens && product.allergens.length > 0 && layout.elements.allergensList?.visible !== false && (
              <div
                className="product-allergens"
                style={{
                  fontSize: `${dimensions.css.allergensFontSize}px`,
                  fontFamily: layout.elements.allergensList.fontFamily,
                  color: layout.elements.allergensList.fontColor,
                  fontWeight: layout.elements.allergensList.fontStyle === 'bold' ? 'bold' : 'normal',
                  fontStyle: layout.elements.allergensList.fontStyle === 'italic' ? 'italic' : 'normal',
                  textAlign: layout.elements.allergensList.alignment as any,
                  lineHeight: 1.5
                }}
              >
                Allergeni: {product.allergens.map(a => a.number).join(', ')}
              </div>
            )}

            {/* Icone caratteristiche prodotto nella stessa riga */}
            {product.features && product.features.length > 0 && layout.productFeatures?.icon && (
              <div
                className="product-features flex items-center gap-1"
                style={{
                  marginLeft: product.allergens && product.allergens.length > 0 ? '8px' : '0'
                }}
              >
                {product.features.map((feature, index) => (
                  feature.icon_url && (
                    <img
                      key={feature.id}
                      src={feature.icon_url}
                      alt={feature.title}
                      className="feature-icon"
                      style={{
                        width: `${dimensions.icons.cssSizePx}px`,
                        height: `${dimensions.icons.cssSizePx}px`,
                        marginRight: index < product.features.length - 1 ? `${dimensions.icons.cssSpacingPx}px` : '0'
                      }}
                    />
                  )
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Colonna prezzo - 10% (Schema 1) */}
      <div 
        className="product-price-column"
        style={{ 
          width: priceWidth,
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
    </div>
  );
};

export default ProductRenderer;
