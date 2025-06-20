
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Allergen } from '@/types/database';
import { ProductFeature } from '@/types/database';

interface AllergensPagePreviewProps {
  layout: PrintLayout;
  allergens: Allergen[];
  productFeatures: ProductFeature[];
  showMargins: boolean;
  pageNumber: number;
}

const AllergensPagePreview: React.FC<AllergensPagePreviewProps> = ({
  layout,
  allergens,
  productFeatures,
  showMargins,
  pageNumber
}) => {
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;

  const getPageMargins = () => {
    const margins = layout.page;
    let topMargin = margins.allergensMarginTop || 20;
    let rightMargin = margins.allergensMarginRight || 15;
    let bottomMargin = margins.allergensMarginBottom || 20;
    let leftMargin = margins.allergensMarginLeft || 15;

    // Check if using distinct margins for odd/even allergens pages
    if (margins.useDistinctMarginsForAllergensPages && pageNumber > 1) {
      if (pageNumber % 2 === 1) { // Odd page
        topMargin = margins.allergensOddPages?.marginTop || topMargin;
        rightMargin = margins.allergensOddPages?.marginRight || rightMargin;
        bottomMargin = margins.allergensOddPages?.marginBottom || bottomMargin;
        leftMargin = margins.allergensOddPages?.marginLeft || leftMargin;
      } else { // Even page
        topMargin = margins.allergensEvenPages?.marginTop || topMargin;
        rightMargin = margins.allergensEvenPages?.marginRight || rightMargin;
        bottomMargin = margins.allergensEvenPages?.marginBottom || bottomMargin;
        leftMargin = margins.allergensEvenPages?.marginLeft || leftMargin;
      }
    }

    return { topMargin, rightMargin, bottomMargin, leftMargin };
  };

  const { topMargin, rightMargin, bottomMargin, leftMargin } = getPageMargins();

  const getPageStyle = () => ({
    width: `${A4_WIDTH_MM}mm`,
    height: `${A4_HEIGHT_MM}mm`,
    padding: `${topMargin}mm ${rightMargin}mm ${bottomMargin}mm ${leftMargin}mm`,
    boxSizing: 'border-box' as const,
    margin: '0 auto 30px auto',
    border: showMargins ? '2px solid #e2e8f0' : '1px solid #e2e8f0',
    boxShadow: showMargins ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0,0,0,0.03)',
    position: 'relative' as const,
    backgroundColor: 'white'
  });

  const getMarginsOverlay = () => {
    if (!showMargins) return null;
    
    return (
      <>
        {/* Top margin */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: `${topMargin}mm`,
            borderBottom: '2px dashed red',
            pointerEvents: 'none'
          }}
        />
        {/* Right margin */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: `${rightMargin}mm`,
            borderLeft: '2px dashed red',
            pointerEvents: 'none'
          }}
        />
        {/* Bottom margin */}
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${bottomMargin}mm`,
            borderTop: '2px dashed red',
            pointerEvents: 'none'
          }}
        />
        {/* Left margin */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: `${leftMargin}mm`,
            borderRight: '2px dashed red',
            pointerEvents: 'none'
          }}
        />
      </>
    );
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">
        Pagina {pageNumber} - Allergeni e Caratteristiche Prodotti
      </h3>
      
      <div 
        className="page allergens-page bg-white relative overflow-hidden"
        style={getPageStyle()}
      >
        {getMarginsOverlay()}
        
        {/* Page number badge for preview */}
        {showMargins && (
          <div 
            className="absolute top-3 left-3 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-bold rounded shadow border border-blue-300"
            style={{zIndex: 100}}
          >
            Pagina {pageNumber}
          </div>
        )}

        {/* Content area */}
        <div className="h-full flex flex-col space-y-4">
          {/* Allergens Title */}
          {layout.allergens?.title && (
            <div
              style={{
                fontSize: `${layout.allergens.title.fontSize}pt`,
                fontFamily: layout.allergens.title.fontFamily,
                color: layout.allergens.title.fontColor,
                fontWeight: layout.allergens.title.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: layout.allergens.title.fontStyle === 'italic' ? 'italic' : 'normal',
                textAlign: layout.allergens.title.alignment as any,
                marginTop: `${layout.allergens.title.margin.top}mm`,
                marginRight: `${layout.allergens.title.margin.right}mm`,
                marginBottom: `${layout.allergens.title.margin.bottom}mm`,
                marginLeft: `${layout.allergens.title.margin.left}mm`,
              }}
            >
              {(layout.allergens.title as any).text || 'Allergeni e Intolleranze'}
            </div>
          )}

          {/* Allergens Description */}
          {layout.allergens?.description && (
            <div
              style={{
                fontSize: `${layout.allergens.description.fontSize}pt`,
                fontFamily: layout.allergens.description.fontFamily,
                color: layout.allergens.description.fontColor,
                fontWeight: layout.allergens.description.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: layout.allergens.description.fontStyle === 'italic' ? 'italic' : 'normal',
                textAlign: layout.allergens.description.alignment as any,
                marginTop: `${layout.allergens.description.margin.top}mm`,
                marginRight: `${layout.allergens.description.margin.right}mm`,
                marginBottom: `${layout.allergens.description.margin.bottom}mm`,
                marginLeft: `${layout.allergens.description.margin.left}mm`,
              }}
            >
              {(layout.allergens.description as any).text || 'Lista degli allergeni presenti nei nostri prodotti'}
            </div>
          )}

          {/* Allergens List */}
          <div className="allergens-list space-y-2">
            {allergens.map((allergen) => (
              <div 
                key={allergen.id}
                className="allergen-item"
                style={{
                  backgroundColor: layout.allergens?.item?.backgroundColor || '#f9f9f9',
                  borderRadius: `${layout.allergens?.item?.borderRadius || 4}px`,
                  padding: `${layout.allergens?.item?.padding || 8}px`,
                  marginBottom: `${layout.allergens?.item?.spacing || 5}px`
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Allergen Icon */}
                  {allergen.icon_url && (
                    <img 
                      src={allergen.icon_url}
                      alt={allergen.title}
                      style={{
                        width: `${layout.allergens?.item?.iconSize || 16}px`,
                        height: `${layout.allergens?.item?.iconSize || 16}px`,
                        flexShrink: 0
                      }}
                    />
                  )}

                  {/* Allergen Number */}
                  <div
                    style={{
                      fontSize: `${layout.allergens?.item?.number?.fontSize || 12}pt`,
                      fontFamily: layout.allergens?.item?.number?.fontFamily || 'Arial',
                      color: layout.allergens?.item?.number?.fontColor || '#000000',
                      fontWeight: layout.allergens?.item?.number?.fontStyle === 'bold' ? 'bold' : 'normal',
                      fontStyle: layout.allergens?.item?.number?.fontStyle === 'italic' ? 'italic' : 'normal',
                      minWidth: '20px',
                      flexShrink: 0
                    }}
                  >
                    {allergen.number}.
                  </div>

                  {/* Allergen Content */}
                  <div className="flex-1">
                    {/* Allergen Title */}
                    <div
                      style={{
                        fontSize: `${layout.allergens?.item?.title?.fontSize || 12}pt`,
                        fontFamily: layout.allergens?.item?.title?.fontFamily || 'Arial',
                        color: layout.allergens?.item?.title?.fontColor || '#333333',
                        fontWeight: layout.allergens?.item?.title?.fontStyle === 'bold' ? 'bold' : 'normal',
                        fontStyle: layout.allergens?.item?.title?.fontStyle === 'italic' ? 'italic' : 'normal',
                      }}
                    >
                      {allergen.title}
                    </div>

                    {/* Allergen Description */}
                    {allergen.description && (
                      <div
                        style={{
                          fontSize: `${layout.allergens?.item?.description?.fontSize || 10}pt`,
                          fontFamily: layout.allergens?.item?.description?.fontFamily || 'Arial',
                          color: layout.allergens?.item?.description?.fontColor || '#666666',
                          fontWeight: layout.allergens?.item?.description?.fontStyle === 'bold' ? 'bold' : 'normal',
                          fontStyle: layout.allergens?.item?.description?.fontStyle === 'italic' ? 'italic' : 'normal',
                          marginTop: '2px'
                        }}
                      >
                        {allergen.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 3cm spacing before product features */}
          <div style={{ height: '30mm' }} />

          {/* Product Features Section */}
          <div className="product-features-section">
            {/* Product Features Title */}
            {layout.productFeatures?.title && (
              <div
                style={{
                  fontSize: `${layout.productFeatures.title.fontSize}pt`,
                  fontFamily: layout.productFeatures.title.fontFamily,
                  color: layout.productFeatures.title.fontColor,
                  fontWeight: layout.productFeatures.title.fontStyle === 'bold' ? 'bold' : 'normal',
                  fontStyle: layout.productFeatures.title.fontStyle === 'italic' ? 'italic' : 'normal',
                  textAlign: layout.productFeatures.title.alignment as any,
                  marginTop: `${layout.productFeatures.title.margin.top}mm`,
                  marginRight: `${layout.productFeatures.title.margin.right}mm`,
                  marginBottom: `${layout.productFeatures.title.margin.bottom}mm`,
                  marginLeft: `${layout.productFeatures.title.margin.left}mm`,
                }}
              >
                Caratteristiche Prodotti
              </div>
            )}

            {/* Product Features List */}
            <div className="product-features-list space-y-2">
              {productFeatures.map((feature) => (
                <div key={feature.id} className="product-feature-item flex items-center gap-3">
                  {/* Feature Icon */}
                  {feature.icon_url && (
                    <img 
                      src={feature.icon_url}
                      alt={feature.title}
                      style={{
                        width: `${layout.productFeatures?.icon?.iconSize || 16}px`,
                        height: `${layout.productFeatures?.icon?.iconSize || 16}px`,
                        flexShrink: 0
                      }}
                    />
                  )}

                  {/* Feature Title */}
                  <div
                    style={{
                      fontSize: `${layout.productFeatures?.title?.fontSize || 12}pt`,
                      fontFamily: layout.productFeatures?.title?.fontFamily || 'Arial',
                      color: layout.productFeatures?.title?.fontColor || '#000000',
                      fontWeight: layout.productFeatures?.title?.fontStyle === 'bold' ? 'bold' : 'normal',
                      fontStyle: layout.productFeatures?.title?.fontStyle === 'italic' ? 'italic' : 'normal',
                    }}
                  >
                    {feature.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllergensPagePreview;
