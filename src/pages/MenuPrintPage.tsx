
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Printer, Download } from 'lucide-react';
import { useMenuLayouts } from '@/hooks/useMenuLayouts';

const MenuPrintPage = () => {
  const [showMargins, setShowMargins] = useState(true);
  const { layouts } = useMenuLayouts();
  
  // Usa il layout di default o il primo disponibile
  const currentLayout = layouts?.find(l => l.isDefault) || layouts?.[0];
  
  const A4_WIDTH_CM = 21;
  const A4_HEIGHT_CM = 29.7;
  
  // Funzione per ottenere i margini dalla configurazione del layout
  const getMargins = (section: 'cover' | 'content' | 'allergens') => {
    if (!currentLayout) return { top: 2.5, right: 2.5, bottom: 2.5, left: 2.5 };
    
    const pageConfig = currentLayout.page;
    
    switch (section) {
      case 'cover':
        return {
          top: (pageConfig.coverMarginTop || 25) / 10, // Converte da mm a cm
          right: (pageConfig.coverMarginRight || 25) / 10,
          bottom: (pageConfig.coverMarginBottom || 25) / 10,
          left: (pageConfig.coverMarginLeft || 25) / 10
        };
      case 'allergens':
        return {
          top: (pageConfig.allergensMarginTop || 20) / 10,
          right: (pageConfig.allergensMarginRight || 15) / 10,
          bottom: (pageConfig.allergensMarginBottom || 20) / 10,
          left: (pageConfig.allergensMarginLeft || 15) / 10
        };
      default: // content
        return {
          top: (pageConfig.marginTop || 20) / 10,
          right: (pageConfig.marginRight || 20) / 10,
          bottom: (pageConfig.marginBottom || 20) / 10,
          left: (pageConfig.marginLeft || 20) / 10
        };
    }
  };

  const PagePreview = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: 'cover' | 'content' | 'allergens';
    children: React.ReactNode;
  }) => {
    const margins = getMargins(section);
    
    return (
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
        <div 
          className="relative bg-white border-2 border-gray-300 shadow-lg"
          style={{
            width: `${A4_WIDTH_CM * 15}px`, // Scala per visualizzazione (15px per cm)
            height: `${A4_HEIGHT_CM * 15}px`,
          }}
        >
          {/* Badge identificativo pagina */}
          <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded z-10">
            {title}
          </div>
          
          {/* Area contenuto con margini */}
          <div 
            className="absolute bg-gray-50"
            style={{
              top: `${margins.top * 15}px`,
              left: `${margins.left * 15}px`,
              right: `${margins.right * 15}px`,
              bottom: `${margins.bottom * 15}px`,
              border: showMargins ? '2px dashed #ef4444' : 'none',
            }}
          >
            <div className="p-4 h-full">
              {children}
            </div>
            
            {/* Etichette margini */}
            {showMargins && (
              <>
                {/* Margine superiore */}
                <div 
                  className="absolute bg-red-500 text-white text-xs px-1 rounded"
                  style={{
                    top: `-${margins.top * 15 / 2}px`,
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                >
                  {margins.top}cm
                </div>
                
                {/* Margine destro */}
                <div 
                  className="absolute bg-red-500 text-white text-xs px-1 rounded"
                  style={{
                    right: `-${margins.right * 15 + 10}px`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    writingMode: 'vertical-rl'
                  }}
                >
                  {margins.right}cm
                </div>
                
                {/* Margine inferiore */}
                <div 
                  className="absolute bg-red-500 text-white text-xs px-1 rounded"
                  style={{
                    bottom: `-${margins.bottom * 15 / 2}px`,
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                >
                  {margins.bottom}cm
                </div>
                
                {/* Margine sinistro */}
                <div 
                  className="absolute bg-red-500 text-white text-xs px-1 rounded"
                  style={{
                    left: `-${margins.left * 15 + 10}px`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    writingMode: 'vertical-rl'
                  }}
                >
                  {margins.left}cm
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Printer className="h-6 w-6 text-primary" />
                  Stampa Menu
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  Gestisci la stampa e l'esportazione PDF del menu del ristorante
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={showMargins ? "default" : "outline"}
                  onClick={() => setShowMargins(!showMargins)}
                  className="gap-2"
                >
                  {showMargins ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showMargins ? 'Nascondi' : 'Mostra'} Margini
                </Button>
                
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Esporta PDF
                </Button>
                
                <Button variant="outline" className="gap-2">
                  <Printer className="h-4 w-4" />
                  Stampa
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Sezioni del menu */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Pagina Copertina */}
          <Card>
            <CardContent className="p-6">
              <PagePreview title="Pagina Copertina" section="cover">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-10 bg-gray-300 mx-auto mb-4 rounded flex items-center justify-center text-xs">
                      Logo
                    </div>
                    <h1 className="text-lg font-bold">Nome Ristorante</h1>
                    <p className="text-sm text-gray-600">Menu del Giorno</p>
                  </div>
                </div>
              </PagePreview>
            </CardContent>
          </Card>

          {/* Pagine Contenuto */}
          <Card>
            <CardContent className="p-6">
              <PagePreview title="Pagine Contenuto" section="content">
                <div className="space-y-3">
                  <h2 className="font-bold text-base border-b pb-1">Antipasti</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">Bruschetta</h3>
                        <p className="text-xs text-gray-600">Pomodoro, basilico, aglio</p>
                      </div>
                      <span className="font-bold text-sm">€8.00</span>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">Antipasto misto</h3>
                        <p className="text-xs text-gray-600">Salumi e formaggi locali</p>
                      </div>
                      <span className="font-bold text-sm">€12.00</span>
                    </div>
                  </div>
                </div>
              </PagePreview>
            </CardContent>
          </Card>

          {/* Pagine Allergeni */}
          <Card>
            <CardContent className="p-6">
              <PagePreview title="Pagina Allergeni" section="allergens">
                <div className="space-y-3">
                  <h2 className="font-bold text-center text-base">Allergeni</h2>
                  <p className="text-xs text-gray-600">
                    Informazioni sui potenziali allergeni presenti nei piatti:
                  </p>
                  <div className="space-y-2">
                    <div className="flex gap-2 text-xs">
                      <span className="font-bold">1.</span>
                      <span>Glutine</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="font-bold">2.</span>
                      <span>Latticini</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="font-bold">3.</span>
                      <span>Frutta a guscio</span>
                    </div>
                  </div>
                </div>
              </PagePreview>
            </CardContent>
          </Card>
        </div>

        {/* Info Layout */}
        {currentLayout && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Layout Corrente: {currentLayout.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="font-semibold mb-2">Margini Copertina</h4>
                  <div className="text-sm space-y-1">
                    <div>Alto: {(currentLayout.page.coverMarginTop || 25) / 10}cm</div>
                    <div>Destro: {(currentLayout.page.coverMarginRight || 25) / 10}cm</div>
                    <div>Basso: {(currentLayout.page.coverMarginBottom || 25) / 10}cm</div>
                    <div>Sinistro: {(currentLayout.page.coverMarginLeft || 25) / 10}cm</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Margini Contenuto</h4>
                  <div className="text-sm space-y-1">
                    <div>Alto: {(currentLayout.page.marginTop || 20) / 10}cm</div>
                    <div>Destro: {(currentLayout.page.marginRight || 20) / 10}cm</div>
                    <div>Basso: {(currentLayout.page.marginBottom || 20) / 10}cm</div>
                    <div>Sinistro: {(currentLayout.page.marginLeft || 20) / 10}cm</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Margini Allergeni</h4>
                  <div className="text-sm space-y-1">
                    <div>Alto: {(currentLayout.page.allergensMarginTop || 20) / 10}cm</div>
                    <div>Destro: {(currentLayout.page.allergensMarginRight || 15) / 10}cm</div>
                    <div>Basso: {(currentLayout.page.allergensMarginBottom || 20) / 10}cm</div>
                    <div>Sinistro: {(currentLayout.page.allergensMarginLeft || 15) / 10}cm</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MenuPrintPage;
