
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrintLayout } from "@/types/printLayout";
import CoverPagePreview from './CoverPagePreview';
import MenuPagePreview from './MenuPagePreview';

interface MenuPrintPreviewProps {
  currentLayout?: PrintLayout;
  showMargins: boolean;
}

const MenuPrintPreview: React.FC<MenuPrintPreviewProps> = ({
  currentLayout,
  showMargins
}) => {
  // A4 dimensions in mm
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  
  // Default margins if no layout exists
  const getMargins = () => {
    if (!currentLayout?.page) {
      return {
        cover: { top: 25, right: 25, bottom: 25, left: 25 },
        content: { top: 20, right: 20, bottom: 20, left: 20 },
        allergens: { top: 20, right: 15, bottom: 20, left: 15 }
      };
    }
    
    return {
      cover: {
        top: currentLayout.page.coverMarginTop || 25,
        right: currentLayout.page.coverMarginRight || 25,
        bottom: currentLayout.page.coverMarginBottom || 25,
        left: currentLayout.page.coverMarginLeft || 25
      },
      content: {
        top: currentLayout.page.marginTop || 20,
        right: currentLayout.page.marginRight || 20,
        bottom: currentLayout.page.marginBottom || 20,
        left: currentLayout.page.marginLeft || 20
      },
      allergens: {
        top: currentLayout.page.allergensMarginTop || 20,
        right: currentLayout.page.allergensMarginRight || 15,
        bottom: currentLayout.page.allergensMarginBottom || 20,
        left: currentLayout.page.allergensMarginLeft || 15
      }
    };
  };
  
  const margins = getMargins();

  return (
    <div className="menu-print-preview-container space-y-8">
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

      {/* Content Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            Pagine Contenuto del Menu
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Margini: {margins.content.top}mm (alto), {margins.content.right}mm (destro), 
            {margins.content.bottom}mm (basso), {margins.content.left}mm (sinistro)
          </p>
        </CardHeader>
        <CardContent>
          <MenuPagePreview
            pageType="content"
            margins={margins.content}
            showMargins={showMargins}
            width={A4_WIDTH_MM}
            height={A4_HEIGHT_MM}
          />
        </CardContent>
      </Card>

      {/* Allergens Page */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            Pagine Allergeni e Caratteristiche del Prodotto
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Margini: {margins.allergens.top}mm (alto), {margins.allergens.right}mm (destro), 
            {margins.allergens.bottom}mm (basso), {margins.allergens.left}mm (sinistro)
          </p>
        </CardHeader>
        <CardContent>
          <MenuPagePreview
            pageType="allergens"
            margins={margins.allergens}
            showMargins={showMargins}
            width={A4_WIDTH_MM}
            height={A4_HEIGHT_MM}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuPrintPreview;
