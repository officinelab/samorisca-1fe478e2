
import React, { useState, useEffect } from 'react';
import { PrintLayout } from '@/types/printLayout';
import { useMenuLayouts } from '@/hooks/useMenuLayouts';
import { RestaurantLogo } from './cover-components/RestaurantLogo';
import { CoverTitles } from './cover-components/CoverTitles';
import { PageDebugInfo } from './cover-components/PageDebugInfo';

type CoverPageProps = {
  A4_WIDTH_MM: number; 
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  layoutType: string;
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
  const { activeLayout } = useMenuLayouts();
  const [menuTitle, setMenuTitle] = useState("Menu");
  const [menuSubtitle, setMenuSubtitle] = useState("Ristorante");
  
  // Aggiorna il titolo e il sottotitolo quando cambia il layout attivo o customLayout
  useEffect(() => {
    if (customLayout) {
      console.log("CoverPage - Usando customLayout:", customLayout.menu_title, customLayout.menu_subtitle);
      setMenuTitle(customLayout.menu_title || "Menu");
      setMenuSubtitle(customLayout.menu_subtitle || "Ristorante");
    } else if (activeLayout) {
      console.log("CoverPage - Usando activeLayout:", activeLayout.menu_title, activeLayout.menu_subtitle);
      setMenuTitle(activeLayout.menu_title || "Menu");
      setMenuSubtitle(activeLayout.menu_subtitle || "Ristorante");
    }
  }, [activeLayout, customLayout]);
  
  useEffect(() => {
    console.log("CoverPage rendering con titolo:", menuTitle, "sottotitolo:", menuSubtitle);
  }, [menuTitle, menuSubtitle]);
  
  const getPageStyle = () => ({
    width: `${A4_WIDTH_MM}mm`,
    height: `${A4_HEIGHT_MM}mm`,
    padding: '20mm 15mm',
    boxSizing: 'border-box' as const,
    margin: '0 auto 60px auto',
    pageBreakAfter: 'always' as const,
    breakAfter: 'page' as const,
    border: showPageBoundaries ? '2px solid #e2e8f0' : 'none',
    boxShadow: showPageBoundaries ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative' as const,
  });

  return (
    <div className="page cover-page bg-white" style={getPageStyle()}>
      {/* Logo del ristorante (componente) */}
      <RestaurantLogo 
        restaurantLogo={restaurantLogo} 
        customLayout={customLayout} 
      />
      
      {/* Titolo e Sottotitolo (componente) */}
      <CoverTitles 
        menuTitle={menuTitle}
        menuSubtitle={menuSubtitle}
        layoutType={layoutType}
        customLayout={customLayout}
      />
      
      {/* Informazioni di debug (componente) */}
      <PageDebugInfo 
        showPageBoundaries={showPageBoundaries} 
        pageIndex={pageIndex} 
      />
    </div>
  );
};

export default CoverPage;
