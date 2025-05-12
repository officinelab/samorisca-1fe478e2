
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { CoverLogo } from './cover/CoverLogo';
import { CoverText } from './cover/CoverText';
import { PageNumberIndicator } from './cover/PageNumberIndicator';
import { getPageStyle } from './cover/CoverPageStyles';

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
  // Controlla se titolo e sottotitolo dovrebbero essere visibili
  const showTitle = !customLayout?.cover?.title || customLayout.cover.title.visible !== false;
  const showSubtitle = !customLayout?.cover?.subtitle || customLayout.cover.subtitle.visible !== false;

  return (
    <div className="page cover-page bg-white" style={getPageStyle(A4_WIDTH_MM, A4_HEIGHT_MM, showPageBoundaries)}>
      {/* Logo del ristorante */}
      <CoverLogo 
        restaurantLogo={restaurantLogo} 
        customLayout={customLayout} 
      />
      
      {/* Titolo e sottotitolo */}
      {(!restaurantLogo || !restaurantLogo.trim()) && (
        <CoverText
          customLayout={customLayout}
          layoutType={layoutType}
          showTitle={showTitle}
          showSubtitle={showSubtitle}
        />
      )}
      
      {/* Debug numero pagina */}
      <PageNumberIndicator 
        showPageBoundaries={showPageBoundaries} 
        pageIndex={pageIndex} 
      />
    </div>
  );
};

export default CoverPage;
