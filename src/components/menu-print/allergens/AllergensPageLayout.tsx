
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Allergen, ProductFeature } from '@/types/database';
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
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;

  // Get margins for allergens page
  const getPageMargins = () => {
    const allergensPageMargins = layout.allergens?.pageMargins;
    return {
      top: allergensPageMargins?.marginTop || 20,
      right: allergensPageMargins?.marginRight || 15, 
      bottom: allergensPageMargins?.marginBottom || 20,
      left: allergensPageMargins?.marginLeft || 15
    };
  };

  const margins = getPageMargins();

  const pageStyle = {
    width: `${A4_WIDTH_MM}mm`,
    height: `${A4_HEIGHT_MM}mm`,
    padding: `${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm`,
    boxSizing: 'border-box' as const,
    margin: '0 auto 30px auto',
    border: showMargins ? '2px solid #e2e8f0' : '1px solid #e2e8f0',
    boxShadow: showMargins ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0,0,0,0.03)',
    position: 'relative' as const,
    backgroundColor: 'white',
    overflow: 'hidden'
  };

  return (
    <div className="allergens-page" style={pageStyle}>
      <PageMarginIndicators
        showMargins={showMargins}
        margins={margins}
      />

      <div className="allergens-content h-full flex flex-col">
        {/* Header con titolo e descrizione solo sulla prima pagina */}
        {isFirstPage && showTitleAndDescription && (
          <AllergensHeader layout={layout} />
        )}

        {/* Lista degli allergeni con spazio zero tra gli elementi */}
        {allergens.length > 0 && (
          <div className="allergens-section flex-1">
            <AllergensList 
              allergens={allergens} 
              layout={layout}
              spacing={0} // Zero spacing tra gli elementi
            />
          </div>
        )}

        {/* Lista delle caratteristiche prodotto */}
        {productFeatures.length > 0 && (
          <div className="product-features-section mt-4">
            <ProductFeaturesList 
              productFeatures={productFeatures} 
              layout={layout}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllergensPageLayout;
