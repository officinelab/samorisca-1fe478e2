
import React from 'react';

export interface PageContainerProps {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  children: React.ReactNode;
  safetyMargin?: {
    vertical: number;
    horizontal: number;
  };
}

const PageContainer: React.FC<PageContainerProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  children,
  safetyMargin = { vertical: 8, horizontal: 3 }
}) => {
  // Calculate actual content area considering safety margins
  const contentWidth = A4_WIDTH_MM - (safetyMargin.horizontal * 2);
  const contentHeight = A4_HEIGHT_MM - (safetyMargin.vertical * 2);
  
  return (
    <div 
      className="page relative bg-white"
      style={{
        width: `${A4_WIDTH_MM}mm`,
        height: `${A4_HEIGHT_MM}mm`,
        margin: '0 auto 60px auto',
        pageBreakAfter: 'always',
        breakAfter: 'page',
        border: showPageBoundaries ? '2px solid #e2e8f0' : 'none',
        boxShadow: showPageBoundaries ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Safety margin visualization */}
      {showPageBoundaries && (
        <div 
          className="safety-margin-indicator absolute border-2 border-dashed border-amber-400/30 pointer-events-none"
          style={{
            top: `${safetyMargin.vertical}mm`,
            left: `${safetyMargin.horizontal}mm`,
            width: `${contentWidth}mm`,
            height: `${contentHeight}mm`,
            zIndex: 1
          }}
        />
      )}
      
      {/* Content container with safety margins applied */}
      <div 
        className="content-area"
        style={{
          padding: `${safetyMargin.vertical}mm ${safetyMargin.horizontal}mm`,
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 2
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
