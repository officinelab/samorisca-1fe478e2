
import React, { useEffect } from 'react';
import { PrintLayout } from '@/types/printLayout';
import { getPageStyle } from './cover/coverStyleUtils';
import CoverLogo from './cover/CoverLogo';
import CoverTitle from './cover/CoverTitle';
import CoverSubtitle from './cover/CoverSubtitle';
import PageNumber from './cover/PageNumber';

type CoverPageProps = {
  A4_WIDTH_MM: number; 
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  layoutType: 'classic' | 'modern' | 'allergens' | 'custom';
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
  pageIndex?: number;
};

const CoverPage: React.FC<CoverPageProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  layoutType,
  restaurantLogo,
  customLayout,
  pageIndex = 0
}) => {
  // Debug logs for development
  useEffect(() => {
    console.log("CoverPage - customLayout:", customLayout);
    console.log("CoverPage - logo config:", customLayout?.cover?.logo);
  }, [customLayout]);
  
  return (
    <div 
      className="page cover-page bg-white" 
      style={getPageStyle(A4_WIDTH_MM, A4_HEIGHT_MM, showPageBoundaries)}
    >
      <CoverLogo 
        restaurantLogo={restaurantLogo} 
        customLayout={customLayout} 
      />
      
      <CoverTitle 
        layoutType={layoutType} 
        customLayout={customLayout} 
      />
      
      <CoverSubtitle 
        layoutType={layoutType} 
        customLayout={customLayout} 
      />
      
      <PageNumber 
        showPageBoundaries={showPageBoundaries} 
        pageIndex={pageIndex} 
      />
    </div>
  );
};

export default CoverPage;
