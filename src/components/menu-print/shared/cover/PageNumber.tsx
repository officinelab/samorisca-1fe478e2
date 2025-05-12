
import React from 'react';

interface PageNumberProps {
  showPageBoundaries: boolean;
  pageIndex: number;
}

const PageNumber: React.FC<PageNumberProps> = ({ showPageBoundaries, pageIndex }) => {
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

export default PageNumber;
