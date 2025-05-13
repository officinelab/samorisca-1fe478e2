
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import CoverLogo from './cover/CoverLogo';
import CoverTitle from './cover/CoverTitle';
import CoverSubtitle from './cover/CoverSubtitle';
import PageContainer from './PageContainer';

export interface CoverPageProps {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  layoutType?: 'classic' | 'modern' | 'allergens' | 'custom';
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
  pageIndex?: number;
  safetyMargin?: {
    vertical: number;
    horizontal: number;
  };
}

const CoverPage: React.FC<CoverPageProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  restaurantLogo,
  customLayout,
  pageIndex = 0,
  safetyMargin = { vertical: 8, horizontal: 3 }
}) => {
  return (
    <PageContainer 
      A4_WIDTH_MM={A4_WIDTH_MM} 
      A4_HEIGHT_MM={A4_HEIGHT_MM} 
      showPageBoundaries={showPageBoundaries}
      safetyMargin={safetyMargin}
    >
      <div className="flex flex-col items-center justify-center h-full relative">
        {/* Logo */}
        <CoverLogo 
          restaurantLogo={restaurantLogo} 
          customLayout={customLayout}
        />
        
        {/* Title */}
        <CoverTitle 
          customLayout={customLayout}
        />
        
        {/* Subtitle */}
        <CoverSubtitle 
          customLayout={customLayout}
        />
        
        {/* Page number */}
        <div className="absolute bottom-4 right-4 text-sm text-gray-500">
          {pageIndex + 1}
        </div>
      </div>
    </PageContainer>
  );
};

export default CoverPage;
