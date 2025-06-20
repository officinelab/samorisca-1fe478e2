
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrintLayout } from "@/types/printLayout";
import CoverPagePreview from './CoverPagePreview';
import MenuContentPages from './MenuContentPages';
import AllergensContentPages from './AllergensContentPages';

interface MenuPrintPreviewProps {
  currentLayout?: PrintLayout;
  showMargins: boolean;
  refreshKey?: number;
}

const MenuPrintPreview: React.FC<MenuPrintPreviewProps> = ({
  currentLayout,
  showMargins,
  refreshKey = 0
}) => {
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  
  const getMargins = () => {
    if (!currentLayout?.page) {
      return {
        cover: { top: 25, right: 25, bottom: 25, left: 25 }
      };
    }
    
    return {
      cover: {
        top: currentLayout.page.coverMarginTop || 25,
        right: currentLayout.page.coverMarginRight || 25,
        bottom: currentLayout.page.coverMarginBottom || 25,
        left: currentLayout.page.coverMarginLeft || 25
      }
    };
  };
  
  const margins = getMargins();

  return (
    <div className="menu-print-preview-container space-y-8" key={`preview-${refreshKey}`}>
      {/* Cover Pages */}
      <Card data-page-preview="cover">
        <CardHeader className="print:hidden">
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            Pagine Copertina del Menu
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Margini: {margins.cover.top}mm (alto), {margins.cover.right}mm (destro), 
            {margins.cover.bottom}mm (basso), {margins.cover.left}mm (sinistro)
          </p>
        </CardHeader>
        <CardContent>
          {/* First Cover Page */}
          <div className="mb-6" data-page-preview="cover-1">
            <h3 className="text-lg font-semibold mb-4 print:hidden">Prima Pagina - Contenuto Copertina</h3>
            <CoverPagePreview
              currentLayout={currentLayout}
              showMargins={showMargins}
              pageNumber={1}
            />
          </div>
          
          {/* Second Cover Page */}
          <div data-page-preview="cover-2">
            <h3 className="text-lg font-semibold mb-4 print:hidden">Seconda Pagina - Pagina Vuota</h3>
            <CoverPagePreview
              currentLayout={currentLayout}
              showMargins={showMargins}
              pageNumber={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Menu Content Pages */}
      <MenuContentPages 
        showMargins={showMargins} 
        layoutRefreshKey={refreshKey}
      />

      {/* Allergens and Product Features Pages */}
      <AllergensContentPages 
        showMargins={showMargins} 
        layoutRefreshKey={refreshKey}
      />
    </div>
  );
};

export default MenuPrintPreview;
