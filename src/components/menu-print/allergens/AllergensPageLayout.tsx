
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Allergen, ProductFeature } from '@/types/database';
import { useDynamicGoogleFont } from '@/hooks/useDynamicGoogleFont';
import AllergensHeader from './AllergensHeader';
import AllergensList from './AllergensList';
import ProductFeaturesList from './ProductFeaturesList';
import PageMarginIndicators from './PageMarginIndicators';

interface AllergensPageLayoutProps {
  layout: PrintLayout;
  allergens: Allergen[];
  productFeatures: ProductFeature[];
  showMargins: boolean;
  pageNumber: number;
  isFirstPage?: boolean;
  showTitleAndDescription?: boolean;
}

const AllergensPageLayout: React.FC<AllergensPageLayoutProps> = ({
  layout,
  allergens,
  productFeatures,
  showMargins,
  pageNumber,
  isFirstPage = false,
  showTitleAndDescription = false
}) => {
  // Carica dinamicamente tutti i font utilizzati nel layout allergeni
  useDynamicGoogleFont(layout.allergens.title.fontFamily);
  useDynamicGoogleFont(layout.allergens.description.fontFamily);
  useDynamicGoogleFont(layout.allergens.item.number.fontFamily);
  useDynamicGoogleFont(layout.allergens.item.title.fontFamily);
  useDynamicGoogleFont(layout.allergens.item.description.fontFamily);
  useDynamicGoogleFont(layout.productFeatures?.title?.fontFamily);

  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;

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
      <PageMarginIndicators showMargins={showMargins} margins={margins} />

      <div className="allergens-content" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {showTitleAndDescription && (
          <AllergensHeader layout={layout} />
        )}

        {/* Sezione Caratteristiche Prodotto - PRIMA degli allergeni */}
        {productFeatures && productFeatures.length > 0 && (
          <ProductFeaturesList
            productFeatures={productFeatures}
            layout={layout}
          />
        )}

        {/* Sezione Allergeni - DOPO le caratteristiche prodotto */}
        {allergens && allergens.length > 0 && (
          <div className="allergens-section" style={{ marginTop: '10mm' }}>
            <AllergensList 
              allergens={allergens}
              layout={layout}
              showTitleAndDescription={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllergensPageLayout;
