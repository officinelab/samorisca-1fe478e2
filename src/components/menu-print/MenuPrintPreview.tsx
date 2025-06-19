
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrintLayout } from "@/types/printLayout";
import CoverPagePreview from './CoverPagePreview';
import MenuContentPages from './MenuContentPages';

interface MenuPrintPreviewProps {
  currentLayout?: PrintLayout;
  showMargins: boolean;
  refreshKey?: number;
  onMenuPagesCalculated?: (pages: any[]) => void;
}

const MenuPrintPreview: React.FC<MenuPrintPreviewProps> = ({
  currentLayout,
  showMargins,
  refreshKey = 0,
  onMenuPagesCalculated
}) => {
  // A4 dimensions in mm
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  
  // Default margins if no layout exists
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
      <Card>
        <CardHeader>
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
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Prima Pagina - Contenuto Copertina</h3>
            <CoverPagePreview
              currentLayout={currentLayout}
              showMargins={showMargins}
              pageNumber={1}
            />
          </div>
          
          {/* Second Cover Page */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Seconda Pagina - Pagina Vuota</h3>
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
        onPagesCalculated={onMenuPagesCalculated}
      />
    </div>
  );
};

export default MenuPrintPreview;
