
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import CoverPage from '../shared/CoverPage';

type ClassicLayoutProps = {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  language: string;
  printAllergens: boolean;
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
};

const ClassicLayout: React.FC<ClassicLayoutProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  restaurantLogo,
  customLayout
}) => {
  return (
    <>
      {/* Pagina di copertina (pagina 1) */}
      <CoverPage 
        A4_WIDTH_MM={A4_WIDTH_MM} 
        A4_HEIGHT_MM={A4_HEIGHT_MM} 
        showPageBoundaries={showPageBoundaries}
        layoutType={customLayout?.type || "classic"}
        restaurantLogo={restaurantLogo}
        customLayout={customLayout}
        pageIndex={1}
      />

      {/* Pagina vuota (pagina 2, retro copertina) */}
      <div 
        className="page blank-page bg-white"
        style={{
          width: `${A4_WIDTH_MM}mm`,
          height: `${A4_HEIGHT_MM}mm`,
          padding: '0',
          boxSizing: 'border-box',
          margin: '0 auto 60px auto',
          pageBreakAfter: 'always',
          breakAfter: 'page',
          border: showPageBoundaries ? '2px dashed #e2e8f0' : 'none',
          boxShadow: showPageBoundaries ? '0 2px 8px rgba(0,0,0,0.03)' : 'none',
          position: 'relative'
        }}
      >
        {/* Badge numero pagina SOLO in anteprima */}
        {showPageBoundaries && (
          <div 
            className="absolute top-3 left-3 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-bold rounded shadow border border-blue-300"
            style={{zIndex: 100}}
          >
            Pagina 2 (Vuota / retro copertina)
          </div>
        )}
      </div>
    </>
  );
};

export default ClassicLayout;
