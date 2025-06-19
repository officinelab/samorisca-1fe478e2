
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Product, Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import ProductRenderer from './ProductRenderer';
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
    if (margins.useDistinctMarginsForPages && page.pageNumber > 1) {
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

    return { topMargin, rightMargin, bottomMargin, leftMargin };
  };

  const { topMargin, rightMargin, bottomMargin, leftMargin } = getPageMargins();

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">
        Pagina {page.pageNumber} - Contenuto Menu
      </h3>
      
      <div 
        className="page menu-content-page bg-white relative overflow-hidden"
        style={{
          width: `${A4_WIDTH_MM}mm`,
          height: `${A4_HEIGHT_MM}mm`,
          padding: `${topMargin}mm ${rightMargin}mm ${bottomMargin}mm ${leftMargin}mm`,
          boxSizing: 'border-box',
          margin: '0 auto',
          border: showMargins ? '2px dashed #e2e8f0' : 'none',
          boxShadow: showMargins ? '0 2px 8px rgba(0,0,0,0.03)' : 'none'
        }}
      >
        {/* Page number badge for preview */}
        {showMargins && (
          <div 
            className="absolute top-3 left-3 px-4 py-2 bg-green-50 text-green-700 text-sm font-bold rounded shadow border border-green-300"
            style={{zIndex: 100}}
          >
            Pagina {page.pageNumber}
          </div>
        )}

        {/* Content area */}
        <div className="h-full flex flex-col">
          {/* Main content */}
          <div className="flex-1 overflow-hidden">
            {page.categories.map((categorySection, categoryIndex) => (
              <div key={`${categorySection.category.id}-${categoryIndex}`}>
                {/* Category title and notes */}
                <CategoryRenderer
                  category={categorySection.category}
                  notes={categorySection.notes}
                  layout={layout}
                  isRepeatedTitle={categorySection.isRepeatedTitle}
                />
                
                {/* Products for this category */}
                <div className="space-y-1">
                  {categorySection.products.map((product, productIndex) => (
                    <ProductRenderer
                      key={product.id}
                      product={product}
                      layout={layout}
                      isLast={productIndex === categorySection.products.length - 1}
                    />
                  ))}
                </div>

                {/* Spacing between categories */}
                {categoryIndex < page.categories.length - 1 && (
                  <div style={{ height: `${layout.spacing.betweenCategories}mm` }} />
                )}
              </div>
            ))}
          </div>

          {/* Service charge line at bottom */}
          <div 
            className="flex-shrink-0 border-t pt-2"
            style={{
              fontSize: `${layout.servicePrice.fontSize}pt`,
              fontFamily: layout.servicePrice.fontFamily,
              color: layout.servicePrice.fontColor,
              fontWeight: layout.servicePrice.fontStyle === 'bold' ? 'bold' : 'normal',
              fontStyle: layout.servicePrice.fontStyle === 'italic' ? 'italic' : 'normal',
              textAlign: layout.servicePrice.alignment as any,
              marginTop: `${layout.servicePrice.margin.top}mm`,
              marginBottom: `${layout.servicePrice.margin.bottom}mm`
            }}
          >
            Servizio e Coperto = €{page.serviceCharge.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuContentPagePreview;
