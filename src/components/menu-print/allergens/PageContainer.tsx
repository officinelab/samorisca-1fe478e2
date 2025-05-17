
import React, { ReactNode } from 'react';

type PageContainerProps = {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  layoutType: 'classic' | 'modern' | 'allergens' | 'custom';
  children: React.ReactNode;
  pageIndex?: number;
  customLayout?: any;
};

const PageContainer: React.FC<PageContainerProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  layoutType,
  children,
  pageIndex = 0,
  customLayout,
}) => {
  // Calcolo dinamico margini
  let marginTop = 20, marginRight = 15, marginBottom = 20, marginLeft = 15;
  if (customLayout && customLayout.page) {
    if (customLayout.page.useDistinctMarginsForPages) {
      const margins =
        pageIndex % 2 === 0
          ? customLayout.page.oddPages || customLayout.page
          : customLayout.page.evenPages || customLayout.page;
      marginTop = margins.marginTop;
      marginRight = margins.marginRight;
      marginBottom = margins.marginBottom;
      marginLeft = margins.marginLeft;
    } else {
      marginTop = customLayout.page.marginTop;
      marginRight = customLayout.page.marginRight;
      marginBottom = customLayout.page.marginBottom;
      marginLeft = customLayout.page.marginLeft;
    }
  }

  const getStyle = () => ({
    width: `${A4_WIDTH_MM}mm`,
    height: `${A4_HEIGHT_MM}mm`,
    padding: `${marginTop}mm ${marginRight}mm ${marginBottom}mm ${marginLeft}mm`,
    boxSizing: 'border-box' as const,
    margin: '0 auto',
    pageBreakAfter: 'avoid' as const,
    breakAfter: 'avoid' as const,
    border: showPageBoundaries ? '2px solid #e2e8f0' : 'none',
    boxShadow: showPageBoundaries ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
    overflow: 'hidden',
    position: 'relative' as const,
  });

  const getContentStyle = () => {
    switch (layoutType) {
      case 'modern':
        return {
          marginTop: '0',
          paddingTop: '0',
          maxHeight: 'calc(100% - 80mm)',
          overflow: 'hidden',
        };
      case 'allergens':
        return {
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '24px',
          maxHeight: 'calc(100% - 80mm)',
          overflow: 'hidden',
        };
      case 'custom':
        return {
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '16px',
          maxHeight: 'calc(100% - 80mm)',
          overflow: 'hidden',
        };
      case 'classic':
      default:
        return {
          marginTop: '0',
          borderTop: 'none',
          paddingTop: '0',
          maxHeight: 'calc(100% - 80mm)',
          overflow: 'hidden',
        };
    }
  };

  return (
    <div className="page relative bg-white" style={getStyle()}>
      <div style={getContentStyle()} className={layoutType === 'classic' ? 'allergens-section' : ''}>
        {children}
      </div>
      
      {/* Indicatore di margine inferiore */}
      <div style={{
        position: 'absolute' as const,
        bottom: '0',
        left: '0',
        width: '100%',
        height: '80mm',
        borderTop: showPageBoundaries ? '1px dashed #cccccc' : 'none',
        opacity: showPageBoundaries ? 0.5 : 0,
        pointerEvents: 'none',
      }} />
    </div>
  );
};

export default PageContainer;
