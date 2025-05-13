
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
}

const PrintPage: React.FC<PrintPageProps> = ({
  children,
  pageIndex,
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  customLayout
}) => {
  // Calcola i margini in base al layout e all'indice della pagina
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
    
    // Pagina dispari (0-based, quindi pageIndex 0, 2, 4... sono pagine 1, 3, 5...)
    if (pageIndex % 2 === 0) {
      return {
        top: customLayout.page.oddPages?.marginTop || customLayout.page.marginTop,
        right: customLayout.page.oddPages?.marginRight || customLayout.page.marginRight,
        bottom: customLayout.page.oddPages?.marginBottom || customLayout.page.marginBottom,
        left: customLayout.page.oddPages?.marginLeft || customLayout.page.marginLeft
      };
    } 
    // Pagina pari (1, 3, 5...)
    else {
      return {
        top: customLayout.page.evenPages?.marginTop || customLayout.page.marginTop,
        right: customLayout.page.evenPages?.marginRight || customLayout.page.marginRight,
        bottom: customLayout.page.evenPages?.marginBottom || customLayout.page.marginBottom,
        left: customLayout.page.evenPages?.marginLeft || customLayout.page.marginLeft
      };
    }
  }, [customLayout, pageIndex]);
  
  // Aggiunge un numero di pagina e indicatori di margine (visibili solo in modalità anteprima)
  const renderPageDebugInfo = () => {
    if (!showPageBoundaries) return null;
    
    return (
      <>
        {/* Numero di pagina */}
        <div 
          className="absolute text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded" 
          style={{
            right: '5mm',
            bottom: '5mm',
            zIndex: 50
          }}
        >
          Pagina {pageIndex + 1}
        </div>
        
        {/* Indicatori dei margini */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Margine superiore */}
          <div className="absolute left-0 right-0 flex justify-center">
            <div 
              className="bg-blue-500/20 px-2 rounded text-xs text-blue-800"
              style={{
                height: `${margins.top}mm`,
                top: 0,
                lineHeight: `${margins.top}mm`
              }}
            >
              Margine superiore: {margins.top}mm
            </div>
          </div>
          
          {/* Margine inferiore */}
          <div className="absolute left-0 right-0 bottom-0 flex justify-center">
            <div 
              className="bg-blue-500/20 px-2 rounded text-xs text-blue-800"
              style={{
                height: `${margins.bottom}mm`,
                bottom: 0,
                lineHeight: `${margins.bottom}mm`
              }}
            >
              Margine inferiore: {margins.bottom}mm
            </div>
          </div>
          
          {/* Margine sinistro */}
          <div 
            className="absolute top-0 bottom-0 left-0 flex flex-col justify-center items-center"
            style={{
              width: `${margins.left}mm`
            }}
          >
            <div 
              className="bg-blue-500/20 px-1 py-2 rounded text-xs text-blue-800 rotate-90"
            >
              Margine sx: {margins.left}mm
            </div>
          </div>
          
          {/* Margine destro */}
          <div 
            className="absolute top-0 bottom-0 right-0 flex flex-col justify-center items-center"
            style={{
              width: `${margins.right}mm`
            }}
          >
            <div 
              className="bg-blue-500/20 px-1 py-2 rounded text-xs text-blue-800 rotate-90"
            >
              Margine dx: {margins.right}mm
            </div>
          </div>
          
          {/* Linea di divisione pagina */}
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
              FINE PAGINA {pageIndex + 1} - INIZIO PAGINA {pageIndex + 2}
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
          position: 'relative'
        }}
      >
        {children}
      </div>
      {showPageBoundaries && renderPageDebugInfo()}
    </div>
  );
};

export default PrintPage;
