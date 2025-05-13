
import React from 'react';
import { getPageMargins } from '@/hooks/print/getPageMargins';
import { PrintLayout } from '@/types/printLayout';

interface PrintPageProps {
  children: React.ReactNode;
  pageIndex: number;
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  customLayout?: PrintLayout | null;
  safetyMargin?: { vertical: number; horizontal: number };
}

const PrintPage: React.FC<PrintPageProps> = ({
  children,
  pageIndex,
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  customLayout,
  safetyMargin = { vertical: 8, horizontal: 3 }
}) => {
  // Calculate margins based on layout and page index
  const margins = React.useMemo(() => {
    if (!customLayout) {
      return { top: 20, right: 15, bottom: 20, left: 15 };
    }
    
    if (!customLayout.page.useDistinctMarginsForPages) {
      return {
        top: customLayout.page.marginTop,
        right: customLayout.page.marginRight,
        bottom: customLayout.page.marginBottom,
        left: customLayout.page.marginLeft
      };
    }
    
    // Odd page (0-based, so pageIndex 0, 2, 4... are pages 1, 3, 5...)
    if (pageIndex % 2 === 0) {
      return {
        top: customLayout.page.oddPages?.marginTop || customLayout.page.marginTop,
        right: customLayout.page.oddPages?.marginRight || customLayout.page.marginRight,
        bottom: customLayout.page.oddPages?.marginBottom || customLayout.page.marginBottom,
        left: customLayout.page.oddPages?.marginLeft || customLayout.page.marginLeft
      };
    } 
    // Even page (1, 3, 5...)
    else {
      return {
        top: customLayout.page.evenPages?.marginTop || customLayout.page.marginTop,
        right: customLayout.page.evenPages?.marginRight || customLayout.page.marginRight,
        bottom: customLayout.page.evenPages?.marginBottom || customLayout.page.marginBottom,
        left: customLayout.page.evenPages?.marginLeft || customLayout.page.marginLeft
      };
    }
  }, [customLayout, pageIndex]);
  
  // Add page number and margin indicators (visible only in preview mode)
  const renderPageDebugInfo = () => {
    if (!showPageBoundaries) return null;
    
    return (
      <>
        {/* Page number */}
        <div 
          className="absolute text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded" 
          style={{
            right: '5mm',
            bottom: '5mm',
            zIndex: 50
          }}
        >
          Page {pageIndex + 1}
        </div>
        
        {/* Margin indicators */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top margin */}
          <div className="absolute left-0 right-0 flex justify-center">
            <div 
              className="bg-blue-500/20 px-2 rounded text-xs text-blue-800"
              style={{
                height: `${margins.top}mm`,
                top: 0,
                lineHeight: `${margins.top}mm`
              }}
            >
              Top margin: {margins.top}mm
            </div>
          </div>
          
          {/* Bottom margin */}
          <div className="absolute left-0 right-0 bottom-0 flex justify-center">
            <div 
              className="bg-blue-500/20 px-2 rounded text-xs text-blue-800"
              style={{
                height: `${margins.bottom}mm`,
                bottom: 0,
                lineHeight: `${margins.bottom}mm`
              }}
            >
              Bottom margin: {margins.bottom}mm
            </div>
          </div>
          
          {/* Left margin */}
          <div 
            className="absolute top-0 bottom-0 left-0 flex flex-col justify-center items-center"
            style={{
              width: `${margins.left}mm`
            }}
          >
            <div 
              className="bg-blue-500/20 px-1 py-2 rounded text-xs text-blue-800 rotate-90"
            >
              Left: {margins.left}mm
            </div>
          </div>
          
          {/* Right margin */}
          <div 
            className="absolute top-0 bottom-0 right-0 flex flex-col justify-center items-center"
            style={{
              width: `${margins.right}mm`
            }}
          >
            <div 
              className="bg-blue-500/20 px-1 py-2 rounded text-xs text-blue-800 rotate-90"
            >
              Right: {margins.right}mm
            </div>
          </div>
          
          {/* Safety margins */}
          {safetyMargin && (
            <>
              {/* Display safety margins */}
              <div 
                className="absolute border border-dashed border-red-400 pointer-events-none"
                style={{
                  top: `${margins.top + safetyMargin.vertical}mm`,
                  left: `${margins.left + safetyMargin.horizontal}mm`,
                  right: `${margins.right + safetyMargin.horizontal}mm`,
                  bottom: `${margins.bottom + safetyMargin.vertical}mm`,
                  zIndex: 5
                }}
              >
                <div className="bg-red-100/30 text-xs text-red-700 px-1 absolute -top-3 left-2">
                  Safety margin
                </div>
              </div>
            </>
          )}
          
          {/* Page break line */}
          <div className="absolute left-0 right-0 bottom-0 flex justify-center">
            <div 
              className="bg-red-300/50 py-1 px-4 text-xs text-red-800 rounded"
              style={{
                transform: 'translateY(50%)',
                zIndex: 50,
                width: 'auto',
                display: 'inline-block',
              }}
            >
              END PAGE {pageIndex} - START PAGE {pageIndex + 1}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div 
      className="page relative bg-white" 
      style={{
        width: `${A4_WIDTH_MM}mm`,
        height: `${A4_HEIGHT_MM}mm`,
        padding: getPageMargins(customLayout, pageIndex),
        boxSizing: 'border-box',
        margin: '0 auto 60px auto',
        pageBreakAfter: 'always',
        breakAfter: 'page',
        border: showPageBoundaries ? '2px solid #e2e8f0' : 'none',
        boxShadow: showPageBoundaries ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
      }}
    >
      <div 
        className="menu-container" 
        style={{ 
          overflow: 'visible',
          height: 'auto',
          position: 'relative',
          // Apply safety margins to content container
          ...(safetyMargin && {
            margin: `${safetyMargin.vertical}mm ${safetyMargin.horizontal}mm`,
          })
        }}
      >
        {children}
      </div>
      {showPageBoundaries && renderPageDebugInfo()}
    </div>
  );
};

export default PrintPage;
