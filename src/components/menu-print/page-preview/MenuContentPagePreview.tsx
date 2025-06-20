
import React from 'react';
import { MenuContentPagePreviewProps } from './types';
import { usePageFonts } from './hooks/usePageFonts';
import { usePageMargins } from './hooks/usePageMargins';
import PageMarginsOverlay from './components/PageMarginsOverlay';
import PageNumberBadge from './components/PageNumberBadge';
import PageContentSection from './components/PageContentSection';
import ServiceChargeSection from './components/ServiceChargeSection';

const MenuContentPagePreview: React.FC<MenuContentPagePreviewProps> = ({
  page,
  layout,
  showMargins
}) => {
  usePageFonts(layout);
  
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;

  const { topMargin, rightMargin, bottomMargin, leftMargin } = usePageMargins(layout, page.pageNumber);

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

  // Controlla se la pagina è dispari per mostrare il servizio e coperto
  const isOddPage = page.pageNumber % 2 === 1;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">
        Pagina {page.pageNumber} - Contenuto Menu
      </h3>
      
      <div 
        className="page menu-content-page bg-white relative overflow-hidden"
        style={getPageStyle()}
      >
        <PageMarginsOverlay
          showMargins={showMargins}
          topMargin={topMargin}
          rightMargin={rightMargin}
          bottomMargin={bottomMargin}
          leftMargin={leftMargin}
        />
        
        <PageNumberBadge
          showMargins={showMargins}
          pageNumber={page.pageNumber}
        />

        {/* Content area */}
        <div className="h-full flex flex-col">
          <PageContentSection
            categories={page.categories}
            layout={layout}
          />

          <ServiceChargeSection
            isOddPage={isOddPage}
            layout={layout}
            serviceCharge={page.serviceCharge}
          />
        </div>
      </div>
    </div>
  );
};

export default MenuContentPagePreview;
