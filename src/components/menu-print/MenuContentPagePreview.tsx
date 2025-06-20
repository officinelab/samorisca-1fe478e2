
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Product, Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import CategoryRenderer from './CategoryRenderer';

interface PageContent {
  pageNumber: number;
  categories: {
    category: Category;
    notes: CategoryNote[];
    products: Product[];
    isRepeatedTitle: boolean;
  }[];
  serviceCharge: number;
}

interface MenuContentPagePreviewProps {
  page: PageContent;
  layout: PrintLayout;
  showMargins: boolean;
}

const MenuContentPagePreview: React.FC<MenuContentPagePreviewProps> = ({
  page,
  layout,
  showMargins
}) => {
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  
  const getPageMargins = () => {
    const margins = layout.page;
    let topMargin = margins.marginTop;
    let rightMargin = margins.marginRight;
    let bottomMargin = margins.marginBottom;
    let leftMargin = margins.marginLeft;

    // Check if using distinct margins for odd/even pages
    if (margins.useDistinctMarginsForPages && page.pageNumber > 2) {
      if (page.pageNumber % 2 === 1) { // Odd page
        topMargin = margins.oddPages.marginTop;
        rightMargin = margins.oddPages.marginRight;
        bottomMargin = margins.oddPages.marginBottom;
        leftMargin = margins.oddPages.marginLeft;
      } else { // Even page
        topMargin = margins.evenPages.marginTop;
        rightMargin = margins.evenPages.marginRight;
        bottomMargin = margins.evenPages.marginBottom;
        leftMargin = margins.evenPages.marginLeft;
      }
    }

    return {
      top: topMargin,
      right: rightMargin,
      bottom: bottomMargin,
      left: leftMargin
    };
  };

  const pageMargins = getPageMargins();
  
  const getPageStyle = () => ({
    width: `${A4_WIDTH_MM}mm`,
    height: `${A4_HEIGHT_MM}mm`,
    padding: `${pageMargins.top}mm ${pageMargins.right}mm ${pageMargins.bottom}mm ${pageMargins.left}mm`,
    boxSizing: 'border-box' as const,
    margin: '0 auto 30px auto',
    border: showMargins ? '2px solid #e2e8f0' : '1px solid #e2e8f0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    position: 'relative' as const,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden'
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
            height: `${pageMargins.top}mm`,
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
            width: `${pageMargins.right}mm`,
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
            height: `${pageMargins.bottom}mm`,
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
            width: `${pageMargins.left}mm`,
            borderRight: '2px dashed red',
            pointerEvents: 'none'
          }}
        />
      </>
    );
  };

  // Show service charge only on odd pages
  const shouldShowServiceCharge = page.pageNumber % 2 === 1;

  const getServiceChargeStyle = () => ({
    marginTop: `${layout.servicePrice.margin.top}mm`,
    marginRight: `${layout.servicePrice.margin.right}mm`,
    marginBottom: `${layout.servicePrice.margin.bottom}mm`,
    marginLeft: `${layout.servicePrice.margin.left}mm`,
    fontSize: `${layout.servicePrice.fontSize}pt`,
    fontFamily: layout.servicePrice.fontFamily,
    fontWeight: layout.servicePrice.fontStyle === 'bold' ? 'bold' : 'normal',
    fontStyle: layout.servicePrice.fontStyle === 'italic' ? 'italic' : 'normal',
    color: layout.servicePrice.fontColor,
    textAlign: layout.servicePrice.alignment as any,
    padding: '3mm 0'
  });

  return (
    <div className="pdf-page-preview menu-content-page-preview" style={getPageStyle()}>
      {getMarginsOverlay()}
      
      {/* Page number badge - only visible in preview */}
      {showMargins && (
        <div 
          className="absolute top-3 left-3 px-4 py-2 bg-green-50 text-green-700 text-sm font-bold rounded shadow border border-green-300"
          style={{zIndex: 100}}
        >
          Pagina {page.pageNumber}
        </div>
      )}
      
      {/* Content container */}
      <div className="flex-1 flex flex-col">
        {/* Categories content */}
        <div className="flex-1">
          {page.categories.map((categoryData, index) => (
            <div key={`${categoryData.category.id}-${index}`}>
              <CategoryRenderer
                category={categoryData.category}
                notes={categoryData.notes}
                products={categoryData.products}
                layout={layout}
                isRepeatedTitle={categoryData.isRepeatedTitle}
                addSpacing={index > 0}
              />
            </div>
          ))}
        </div>
        
        {/* Service charge - only on odd pages */}
        {shouldShowServiceCharge && layout.servicePrice.visible && (
          <div className="mt-auto">
            <div style={getServiceChargeStyle()}>
              Servizio e coperto €{page.serviceCharge.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuContentPagePreview;
