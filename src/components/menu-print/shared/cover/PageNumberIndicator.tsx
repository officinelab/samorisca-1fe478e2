
import React from 'react';

interface PageNumberIndicatorProps {
  showPageBoundaries: boolean;
  pageIndex: number;
}

export const PageNumberIndicator: React.FC<PageNumberIndicatorProps> = ({ 
  showPageBoundaries, 
  pageIndex 
}) => {
  if (!showPageBoundaries) return null;

  return (
    <div 
      className="absolute text-xs text-muted-foreground" 
      style={{
        right: '5mm',
        bottom: '5mm'
      }}
    >
      Copertina (Pagina {pageIndex})
    </div>
  );
};
