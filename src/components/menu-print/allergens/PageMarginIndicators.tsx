
import React from 'react';

interface PageMarginIndicatorsProps {
  showMargins: boolean;
  margins: {
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
  };
}

const PageMarginIndicators: React.FC<PageMarginIndicatorsProps> = ({ 
  showMargins, 
  margins 
}) => {
  if (!showMargins) return null;

  return (
    <>
      <div className="absolute top-0 left-0 w-full border-t-2 border-dashed border-red-400" 
           style={{ top: `${margins.marginTop}mm` }} />
      <div className="absolute bottom-0 left-0 w-full border-b-2 border-dashed border-red-400" 
           style={{ bottom: `${margins.marginBottom}mm` }} />
      <div className="absolute top-0 left-0 h-full border-l-2 border-dashed border-red-400" 
           style={{ left: `${margins.marginLeft}mm` }} />
      <div className="absolute top-0 right-0 h-full border-r-2 border-dashed border-red-400" 
           style={{ right: `${margins.marginRight}mm` }} />
    </>
  );
};

export default PageMarginIndicators;
