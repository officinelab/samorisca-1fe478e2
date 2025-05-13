
import React from 'react';
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
  // Calcola i margini di pagina in base al layout e all'indice pagina
  const getPageMargins = () => {
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
    
    // pagina dispari (indici 0, 2, 4... sono pagine 1, 3, 5...)
    if ((pageIndex - 1) % 2 === 0) {
      return {
        top: customLayout.page.oddPages?.marginTop || customLayout.page.marginTop,
        right: customLayout.page.oddPages?.marginRight || customLayout.page.marginRight,
        bottom: customLayout.page.oddPages?.marginBottom || customLayout.page.marginBottom,
        left: customLayout.page.oddPages?.marginLeft || customLayout.page.marginLeft
      };
    } 
    // pagina pari (indici 1, 3, 5... sono pagine 2, 4, 6...)
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
    <div className="page relative bg-white" style={{
      width: `${A4_WIDTH_MM}mm`,
      height: `${A4_HEIGHT_MM}mm`,
      padding: `${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm`,
      boxSizing: 'border-box',
      margin: '0 auto 60px auto',
      pageBreakAfter: 'always',
      breakAfter: 'page',
      border: showPageBoundaries ? '2px solid #e2e8f0' : 'none',
      boxShadow: showPageBoundaries ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
      overflow: 'hidden'
    }}>
      {/* Indicatore di pagina visibile solo quando showPageBoundaries è true */}
      {showPageBoundaries && (
        <div className="page-boundary absolute top-2 left-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded z-50">
          Pagina {pageIndex}
        </div>
      )}
      
      {/* Contenuto della pagina */}
      <div className="menu-container" style={{
        height: '100%',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'visible'
      }}>
        {children}
      </div>
    </div>
  );
};

export default PrintPage;
