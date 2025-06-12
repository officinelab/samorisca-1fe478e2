
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer, FileDown, Eye, EyeOff } from "lucide-react";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";

const MenuPrint = () => {
  const [showMargins, setShowMargins] = useState(false);
  const { layouts } = useMenuLayouts();
  
  // Usa il primo layout disponibile o valori di default
  const currentLayout = layouts?.[0];
  
  // Dimensioni A4 in mm
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  
  // Margini di default se non ci sono layout
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
  
  const getPageStyle = (marginConfig: any) => ({
    width: `${A4_WIDTH_MM}mm`,
    height: `${A4_HEIGHT_MM}mm`,
    padding: `${marginConfig.top}mm ${marginConfig.right}mm ${marginConfig.bottom}mm ${marginConfig.left}mm`,
    boxSizing: 'border-box' as const,
    margin: '0 auto 30px auto',
    border: showMargins ? '2px solid #e2e8f0' : '1px solid #e2e8f0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    position: 'relative' as const,
    backgroundColor: 'white'
  });
  
  const getMarginsOverlay = (marginConfig: any) => {
    if (!showMargins) return null;
    
    return (
      <>
        {/* Margine superiore */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: `${marginConfig.top}mm`,
            borderBottom: '2px dashed red',
            pointerEvents: 'none'
          }}
        />
        {/* Margine destro */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: `${marginConfig.right}mm`,
            borderLeft: '2px dashed red',
            pointerEvents: 'none'
          }}
        />
        {/* Margine inferiore */}
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${marginConfig.bottom}mm`,
            borderTop: '2px dashed red',
            pointerEvents: 'none'
          }}
        />
        {/* Margine sinistro */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: `${marginConfig.left}mm`,
            borderRight: '2px dashed red',
            pointerEvents: 'none'
          }}
        />
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stampa Menu</h1>
          <p className="text-muted-foreground">
            Gestisci la stampa e il salvataggio del menu in formato PDF
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={showMargins ? "default" : "outline"}
            onClick={() => setShowMargins(!showMargins)}
          >
            {showMargins ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showMargins ? "Nascondi" : "Mostra"} Margini
          </Button>
          
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Stampa
          </Button>
          
          <Button>
            <FileDown className="w-4 h-4 mr-2" />
            Salva PDF
          </Button>
        </div>
      </div>

      {/* Sezioni del Menu */}
      <div className="space-y-8">
        
        {/* Pagina Copertina */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              Pagina Copertina del Menu
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Margini: {margins.cover.top}mm (alto), {margins.cover.right}mm (destro), 
              {margins.cover.bottom}mm (basso), {margins.cover.left}mm (sinistro)
            </p>
          </CardHeader>
          <CardContent>
            <div style={getPageStyle(margins.cover)}>
              {getMarginsOverlay(margins.cover)}
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">Pagina Copertina</div>
                  <div className="text-sm">Contenuto della copertina del menu</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pagine Contenuto */}
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
            <div style={getPageStyle(margins.content)}>
              {getMarginsOverlay(margins.content)}
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">Pagina Contenuto</div>
                  <div className="text-sm">Contenuto delle pagine interne del menu</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pagina Allergeni */}
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
            <div style={getPageStyle(margins.allergens)}>
              {getMarginsOverlay(margins.allergens)}
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">Pagina Allergeni</div>
                  <div className="text-sm">Contenuto allergeni e caratteristiche prodotti</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
};

export default MenuPrint;
