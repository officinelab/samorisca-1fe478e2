
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

interface PrintPageProps {
  pageIndex: number;
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  customLayout?: PrintLayout | null;
  children: React.ReactNode;
}

const PrintPage: React.FC<PrintPageProps> = ({
  pageIndex,
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  customLayout,
  children
}) => {
  // Calcola i margini in base al tipo di pagina (pari/dispari) e al layout
  const getPageMargins = () => {
    const defaultMargins = {
      top: 20,
      right: 15,
      bottom: 20,
      left: 15
    };
    
    if (!customLayout) return defaultMargins;
    
    // Se non è attivata l'opzione per margini distinti tra pagine pari/dispari
    if (!customLayout.page.useDistinctMarginsForPages) {
      return {
        top: customLayout.page.marginTop,
        right: customLayout.page.marginRight,
        bottom: customLayout.page.marginBottom,
        left: customLayout.page.marginLeft
      };
    }
    
    // Pagina dispari (1, 3, 5...)
    if (pageIndex % 2 !== 0) {
      return {
        top: customLayout.page.oddPages?.marginTop || customLayout.page.marginTop,
        right: customLayout.page.oddPages?.marginRight || customLayout.page.marginRight,
        bottom: customLayout.page.oddPages?.marginBottom || customLayout.page.marginBottom,
        left: customLayout.page.oddPages?.marginLeft || customLayout.page.marginLeft
      };
    } 
    // Pagina pari (2, 4, 6...)
    else {
      return {
        top: customLayout.page.evenPages?.marginTop || customLayout.page.marginTop,
        right: customLayout.page.evenPages?.marginRight || customLayout.page.marginRight,
        bottom: customLayout.page.evenPages?.marginBottom || customLayout.page.marginBottom,
        left: customLayout.page.evenPages?.marginLeft || customLayout.page.marginLeft
      };
    }
  };
  
  const margins = getPageMargins();
  
  return (
    <div 
      className="page relative bg-white print:bg-white" 
      style={{
        width: `${A4_WIDTH_MM}mm`,
        height: `${A4_HEIGHT_MM}mm`,
        padding: `${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm`,
        boxSizing: 'border-box',
        margin: '0 auto 60px auto',
        pageBreakAfter: 'always',
        breakAfter: 'page',
        border: showPageBoundaries ? '2px solid #e2e8f0' : 'none',
        boxShadow: showPageBoundaries ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
        position: 'relative'
      }}
    >
      {/* Contenuto della pagina */}
      <div className="content" style={{ height: '100%', position: 'relative' }}>
        {children}
      </div>
      
      {/* Indicatore del margine inferiore */}
      {showPageBoundaries && (
        <div 
          style={{
            position: 'absolute',
            bottom: `${margins.bottom}mm`,
            left: 0,
            width: '100%',
            borderBottom: '2px dashed rgba(255, 0, 0, 0.5)',
            zIndex: 100,
            pointerEvents: 'none'
          }}
          className="print:hidden"
        />
      )}
      
      {/* Numerazione pagina */}
      <div 
        className="page-number" 
        style={{
          position: 'absolute',
          bottom: `${margins.bottom / 2}mm`,
          right: `${margins.right}mm`,
          fontSize: '10pt',
          color: '#666',
          textAlign: 'right'
        }}
      >
        {pageIndex}
      </div>
    </div>
  );
};

export default PrintPage;
