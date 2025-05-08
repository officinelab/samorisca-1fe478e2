
import React, { ReactNode } from 'react';

type PageContainerProps = {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  layoutType: 'classic' | 'modern' | 'allergens';
  children: ReactNode;
};

const PageContainer: React.FC<PageContainerProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  layoutType,
  children
}) => {
  const getStyle = () => ({
    width: `${A4_WIDTH_MM}mm`,
    height: `${A4_HEIGHT_MM}mm`,
    padding: '20mm 15mm 80mm 15mm',
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
