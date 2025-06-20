
import React from 'react';

interface PageNumberBadgeProps {
  showMargins: boolean;
  pageNumber: number;
}

const PageNumberBadge: React.FC<PageNumberBadgeProps> = ({
  showMargins,
  pageNumber
}) => {
  if (!showMargins) return null;

  return (
    <div 
      className="absolute top-3 left-3 px-4 py-2 bg-green-50 text-green-700 text-sm font-bold rounded shadow border border-green-300"
      style={{zIndex: 100}}
    >
      Pagina {pageNumber}
    </div>
  );
};

export default PageNumberBadge;
