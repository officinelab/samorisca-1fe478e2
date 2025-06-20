
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Product } from '@/types/database';

interface ProductContentProps {
  product: Product;
  layout: PrintLayout;
  dimensions: any;
}

const ProductContent: React.FC<ProductContentProps> = ({
  product,
  layout,
  dimensions
}) => {
  // Verifica se mostrare descrizione inglese
  const shouldShowEnglishDescription = product.description_en && 
    product.description_en !== product.description;

  return (
    <div 
      className="product-content flex-1"
      style={{ width: '90%', paddingRight: '3mm' }}
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
  );
};

export default ProductContent;
