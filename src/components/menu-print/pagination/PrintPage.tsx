
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
  // Aggiunge un numero di pagina in basso a destra (visibile solo in modalità anteprima)
  const renderPageNumber = () => {
    if (!showPageBoundaries) return null;
    
    return (
      <div 
        className="absolute text-xs text-muted-foreground" 
        style={{
          right: '5mm',
          bottom: '5mm'
        }}
      >
        Pagina {pageIndex}
      </div>
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
      {renderPageNumber()}
    </div>
  );
};

export default PrintPage;
