import React from 'react';
import { PrintLayout } from '@/types/printLayout';

interface PrintPageProps {
  pageIndex: number; // 3, 4, 5, ... (numero umano già passato)
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  customLayout?: PrintLayout | null;
  children: React.ReactNode;
}

// Funzione per calcolare i margini in base al layout e all'indice della pagina
const getPageMargins = (customLayout: PrintLayout | null | undefined, pageIndex: number) => {
  if (!customLayout) {
    return {
      marginTop: '20mm',
      marginRight: '15mm',
      marginBottom: '20mm',
      marginLeft: '15mm',
    };
  }

  // Verifica se sono abilitati margini distinti per pagine pari/dispari
  if (customLayout.page.useDistinctMarginsForPages) {
    // Pagina dispari (indice 0, 2, 4 = pagine 1, 3, 5...)
    if (pageIndex % 2 === 1) {
      return {
        marginTop: `${customLayout.page.oddPages?.marginTop || customLayout.page.marginTop}mm`,
        marginRight: `${customLayout.page.oddPages?.marginRight || customLayout.page.marginRight}mm`,
        marginBottom: `${customLayout.page.oddPages?.marginBottom || customLayout.page.marginBottom}mm`,
        marginLeft: `${customLayout.page.oddPages?.marginLeft || customLayout.page.marginLeft}mm`,
      };
    } 
    // Pagina pari (indice 1, 3, 5 = pagine 2, 4, 6...)
    else {
      return {
        marginTop: `${customLayout.page.evenPages?.marginTop || customLayout.page.marginTop}mm`,
        marginRight: `${customLayout.page.evenPages?.marginRight || customLayout.page.marginRight}mm`,
        marginBottom: `${customLayout.page.evenPages?.marginBottom || customLayout.page.marginBottom}mm`,
        marginLeft: `${customLayout.page.evenPages?.marginLeft || customLayout.page.marginLeft}mm`,
      };
    }
  }

  // Usa gli stessi margini per tutte le pagine
  return {
    marginTop: `${customLayout.page.marginTop}mm`,
    marginRight: `${customLayout.page.marginRight}mm`,
    marginBottom: `${customLayout.page.marginBottom}mm`,
    marginLeft: `${customLayout.page.marginLeft}mm`,
  };
};

const PrintPage: React.FC<PrintPageProps> = ({ 
  pageIndex, // 3, 4, 5, ... (numero umano già passato)
  A4_WIDTH_MM, 
  A4_HEIGHT_MM, 
  showPageBoundaries, 
  customLayout,
  children 
}) => {
  // Calcolo margini dinamici come negli altri container
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

  return (
    <div 
      className="page bg-white relative" 
      style={{
        width: `${A4_WIDTH_MM}mm`,
        height: `${A4_HEIGHT_MM}mm`,
        padding: `${marginTop}mm ${marginRight}mm ${marginBottom}mm ${marginLeft}mm`,
        boxSizing: 'border-box',
        margin: '0 auto 60px auto',
        pageBreakAfter: 'always',
        breakAfter: 'page',
        border: showPageBoundaries ? '2px solid #e2e8f0' : 'none',
        boxShadow: showPageBoundaries ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
      }}
    >
      {/* Badge visibile solo in anteprima */}
      {showPageBoundaries && (
        <div 
          className="absolute top-3 left-3 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-bold rounded shadow border border-blue-300"
          style={{zIndex: 100}}
        >
          Pagina {pageIndex}
        </div>
      )}
      <div className="print-content" style={{ position: 'relative' }}>
        {children}
      </div>
      {showPageBoundaries && (
        <div 
          className="page-margin-indicator" 
          style={{
            position: 'absolute',
            bottom: `${marginBottom}mm`,
            left: `${marginLeft}mm`,
            right: `${marginRight}mm`,
            borderBottom: '2px dashed rgba(255, 0, 0, 0.5)',
            pointerEvents: 'none',
            zIndex: 1000
          }}
          title="Limite margine inferiore"
        />
      )}
    </div>
  );
};

export default PrintPage;
