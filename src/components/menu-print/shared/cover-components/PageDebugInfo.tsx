
import React from 'react';

interface PageDebugInfoProps {
  showPageBoundaries: boolean;
  pageIndex: number;
}

export const PageDebugInfo: React.FC<PageDebugInfoProps> = ({ 
  showPageBoundaries, 
  pageIndex 
}) => {
  if (!showPageBoundaries) {
    return null;
  }
  
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
