
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Allergen, ProductFeature } from '@/types/database';
import { getStandardizedDimensions } from '@/hooks/print/pdf/utils/conversionUtils';

interface AllergensPagePreviewProps {
  layout: PrintLayout;
  allergens: Allergen[];
  productFeatures: ProductFeature[];
  showMargins: boolean;
  pageNumber: number;
  isFirstPage?: boolean;
  showTitleAndDescription?: boolean;
}

const AllergensPagePreview: React.FC<AllergensPagePreviewProps> = ({
  layout,
  allergens,
  productFeatures,
  showMargins,
  pageNumber,
  isFirstPage = false,
  showTitleAndDescription = false
}) => {
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  const dimensions = getStandardizedDimensions(layout);

  // Get page margins based on allergens page settings
  const getPageMargins = () => {
    if (layout.page.useDistinctMarginsForAllergensPages && pageNumber) {
      const isOddPage = pageNumber % 2 === 1;
      if (isOddPage && layout.page.allergensOddPages) {
        return layout.page.allergensOddPages;
      } else if (!isOddPage && layout.page.allergensEvenPages) {
        return layout.page.allergensEvenPages;
      }
    }
    return {
      marginTop: layout.page.allergensMarginTop,
      marginRight: layout.page.allergensMarginRight,
      marginBottom: layout.page.allergensMarginBottom,
      marginLeft: layout.page.allergensMarginLeft
    };
  };

  const margins = getPageMargins();

  return (
    <div className="allergens-page relative bg-white" style={{
      width: `${A4_WIDTH_MM}mm`,
      height: `${A4_HEIGHT_MM}mm`,
      padding: `${margins.marginTop}mm ${margins.marginRight}mm ${margins.marginBottom}mm ${margins.marginLeft}mm`,
      boxSizing: 'border-box',
      margin: '0 auto 20px auto',
      border: showMargins ? '1px solid #cbd5e1' : '1px solid #e2e8f0',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden'
    }}>
      {/* Margin indicators - più visibili quando showMargins è attivo */}
      {showMargins && (
        <>
          <div className="absolute top-0 left-0 w-full border-t-2 border-dashed border-red-400" 
               style={{ top: `${margins.marginTop}mm` }} />
          <div className="absolute bottom-0 left-0 w-full border-b-2 border-dashed border-red-400" 
               style={{ bottom: `${margins.marginBottom}mm` }} />
          <div className="absolute top-0 left-0 h-full border-l-2 border-dashed border-red-400" 
               style={{ left: `${margins.marginLeft}mm` }} />
          <div className="absolute top-0 right-0 h-full border-r-2 border-dashed border-red-400" 
               style={{ right: `${margins.marginRight}mm` }} />
        </>
      )}

      <div className="allergens-content">
        {/* Titolo e Descrizione Menu Allergeni - solo sulla prima pagina */}
        {showTitleAndDescription && (
          <>
            <div
              className="allergens-title"
              style={{
                fontSize: `${dimensions.css.categoryFontSize}px`,
                fontFamily: layout.allergens.title.fontFamily,
                color: layout.allergens.title.fontColor,
                fontWeight: layout.allergens.title.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: layout.allergens.title.fontStyle === 'italic' ? 'italic' : 'normal',
                textAlign: layout.allergens.title.alignment as any,
                marginTop: `${layout.allergens.title.margin.top}mm`,
                marginBottom: `${layout.allergens.title.margin.bottom}mm`,
                marginLeft: `${layout.allergens.title.margin.left}mm`,
                marginRight: `${layout.allergens.title.margin.right}mm`,
                lineHeight: 1.3
              }}
            >
              {layout.allergens.title.text || 'Allergeni e Intolleranze'}
            </div>

            <div
              className="allergens-description"
              style={{
                fontSize: `${dimensions.css.descriptionFontSize}px`,
                fontFamily: layout.allergens.description.fontFamily,
                color: layout.allergens.description.fontColor,
                fontWeight: layout.allergens.description.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: layout.allergens.description.fontStyle === 'italic' ? 'italic' : 'normal',
                textAlign: layout.allergens.description.alignment as any,
                marginTop: `${layout.allergens.description.margin.top}mm`,
                marginBottom: `${layout.allergens.description.margin.bottom}mm`,
                marginLeft: `${layout.allergens.description.margin.left}mm`,
                marginRight: `${layout.allergens.description.margin.right}mm`,
                lineHeight: 1.4
              }}
            >
              {layout.allergens.description.text || 'Lista completa degli allergeni presenti nei nostri prodotti'}
            </div>
          </>
        )}

        {/* Sezioni Allergeni */}
        {allergens.length > 0 && (
          <div className="allergens-list" style={{ 
            marginTop: showTitleAndDescription ? '10mm' : '0mm' 
          }}>
            {allergens.map((allergen, index) => (
              <div
                key={allergen.id}
                className="allergen-item"
                style={{
                  marginBottom: `${layout.allergens.item.spacing}mm`,
                  backgroundColor: layout.allergens.item.backgroundColor,
                  padding: `${layout.allergens.item.padding}mm`,
                  borderRadius: `${layout.allergens.item.borderRadius}px`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2mm'
                }}
              >
                {/* Prima riga: Icona, Numero, Titolo */}
                <div className="allergen-header" style={{ display: 'flex', alignItems: 'center', gap: '5mm' }}>
                  {/* Icona allergene */}
                  {allergen.icon_url && (
                    <div style={{
                      width: `${layout.allergens.item.iconSize}px`,
                      height: `${layout.allergens.item.iconSize}px`,
                      flexShrink: 0
                    }}>
                      <img
                        src={allergen.icon_url}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  )}

                  {/* Numero allergene */}
                  <div
                    className="allergen-number"
                    style={{
                      fontSize: `${layout.allergens.item.number.fontSize}px`,
                      fontFamily: layout.allergens.item.number.fontFamily,
                      color: layout.allergens.item.number.fontColor,
                      fontWeight: layout.allergens.item.number.fontStyle === 'bold' ? 'bold' : 'normal',
                      fontStyle: layout.allergens.item.number.fontStyle === 'italic' ? 'italic' : 'normal',
                      textAlign: layout.allergens.item.number.alignment as any,
                      marginTop: `${layout.allergens.item.number.margin.top}mm`,
                      marginBottom: `${layout.allergens.item.number.margin.bottom}mm`,
                      marginLeft: `${layout.allergens.item.number.margin.left}mm`,
                      marginRight: `${layout.allergens.item.number.margin.right}mm`
                    }}
                  >
                    {allergen.number}
                  </div>

                  {/* Titolo allergene */}
                  <div
                    className="allergen-title"
                    style={{
                      fontSize: `${layout.allergens.item.title.fontSize}px`,
                      fontFamily: layout.allergens.item.title.fontFamily,
                      color: layout.allergens.item.title.fontColor,
                      fontWeight: layout.allergens.item.title.fontStyle === 'bold' ? 'bold' : 'normal',
                      fontStyle: layout.allergens.item.title.fontStyle === 'italic' ? 'italic' : 'normal',
                      textAlign: layout.allergens.item.title.alignment as any,
                      marginTop: `${layout.allergens.item.title.margin.top}mm`,
                      marginBottom: `${layout.allergens.item.title.margin.bottom}mm`,
                      marginLeft: `${layout.allergens.item.title.margin.left}mm`,
                      marginRight: `${layout.allergens.item.title.margin.right}mm`,
                      flex: 1
                    }}
                  >
                    {allergen.title}
                  </div>
                </div>

                {/* Seconda riga: Descrizione (se presente) */}
                {allergen.description && (
                  <div
                    className="allergen-description"
                    style={{
                      fontSize: `${layout.allergens.item.description.fontSize}px`,
                      fontFamily: layout.allergens.item.description.fontFamily,
                      color: layout.allergens.item.description.fontColor,
                      fontWeight: layout.allergens.item.description.fontStyle === 'bold' ? 'bold' : 'normal',
                      fontStyle: layout.allergens.item.description.fontStyle === 'italic' ? 'italic' : 'normal',
                      textAlign: layout.allergens.item.description.alignment as any,
                      marginTop: `${layout.allergens.item.description.margin.top}mm`,
                      marginBottom: `${layout.allergens.item.description.margin.bottom}mm`,
                      marginLeft: `${layout.allergens.item.description.margin.left}mm`,
                      marginRight: `${layout.allergens.item.description.margin.right}mm`,
                      lineHeight: 1.4
                    }}
                  >
                    {allergen.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Spazio prima delle caratteristiche prodotto */}
        {allergens.length > 0 && productFeatures.length > 0 && (
          <div style={{ height: '30mm' }} />
        )}

        {/* Sezione Caratteristiche Prodotto */}
        {productFeatures.length > 0 && (
          <div className="product-features-section">
            <div className="product-features-list">
              {productFeatures.map((feature, index) => (
                <div
                  key={feature.id}
                  className="product-feature-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5mm',
                    marginBottom: `${layout.productFeatures.icon.marginBottom}mm`,
                    marginTop: index === 0 ? `${layout.productFeatures.icon.marginTop}mm` : '0'
                  }}
                >
                  {/* Icona caratteristica */}
                  {feature.icon_url && (
                    <div style={{
                      width: `${layout.productFeatures.icon.iconSize}px`,
                      height: `${layout.productFeatures.icon.iconSize}px`,
                      flexShrink: 0
                    }}>
                      <img
                        src={feature.icon_url}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  )}

                  {/* Titolo caratteristica */}
                  <div
                    className="feature-title"
                    style={{
                      fontSize: `${layout.productFeatures.title.fontSize}px`,
                      fontFamily: layout.productFeatures.title.fontFamily,
                      color: layout.productFeatures.title.fontColor,
                      fontWeight: layout.productFeatures.title.fontStyle === 'bold' ? 'bold' : 'normal',
                      fontStyle: layout.productFeatures.title.fontStyle === 'italic' ? 'italic' : 'normal',
                      textAlign: layout.productFeatures.title.alignment as any,
                      marginTop: `${layout.productFeatures.title.margin.top}mm`,
                      marginBottom: `${layout.productFeatures.title.margin.bottom}mm`,
                      marginLeft: `${layout.productFeatures.title.margin.left}mm`,
                      marginRight: `${layout.productFeatures.title.margin.right}mm`
                    }}
                  >
                    {feature.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllergensPagePreview;
