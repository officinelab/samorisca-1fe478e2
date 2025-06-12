
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, FileText, Download } from 'lucide-react';
import { useMenuLayouts } from '@/hooks/useMenuLayouts';

// Costanti per il formato A4 in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

const MenuPrint = () => {
  const [showMargins, setShowMargins] = useState(true);
  const { layouts } = useMenuLayouts();
  
  // Trova il layout di default
  const defaultLayout = layouts?.find(l => l.isDefault) || layouts?.[0];

  // Stili per le pagine A4
  const getPageStyle = (marginConfig: any) => ({
    width: `${A4_WIDTH_MM}mm`,
    height: `${A4_HEIGHT_MM}mm`,
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    margin: '20px auto',
    position: 'relative' as const,
    border: showMargins ? '2px dashed #ef4444' : '1px solid #e5e5e5',
    padding: showMargins ? 
      `${marginConfig?.marginTop || 20}mm ${marginConfig?.marginRight || 15}mm ${marginConfig?.marginBottom || 20}mm ${marginConfig?.marginLeft || 15}mm` :
      '20mm 15mm'
  });

  // Stili per evidenziare i margini
  const getMarginIndicatorStyle = (marginConfig: any) => {
    if (!showMargins) return { display: 'none' };
    
    return {
      position: 'absolute' as const,
      top: `${marginConfig?.marginTop || 20}mm`,
      left: `${marginConfig?.marginLeft || 15}mm`,
      right: `${marginConfig?.marginRight || 15}mm`,
      bottom: `${marginConfig?.marginBottom || 20}mm`,
      border: '1px dashed #ef4444',
      pointerEvents: 'none' as const,
      zIndex: 10
    };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Placeholder per futura implementazione PDF
    console.log('Download PDF - Da implementare');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header con controlli */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Stampa Menu</h1>
          <p className="text-muted-foreground">
            Anteprima e stampa del menu in formato A4 (21cm × 29.7cm)
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowMargins(!showMargins)}
            className="flex items-center gap-2"
          >
            {showMargins ? <EyeOff size={16} /> : <Eye size={16} />}
            {showMargins ? 'Nascondi Margini' : 'Mostra Margini'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2 print:hidden"
          >
            <FileText size={16} />
            Stampa
          </Button>
          
          <Button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Salva PDF
          </Button>
        </div>
      </div>

      {/* Sezioni del Menu */}
      <div className="space-y-8">
        
        {/* 1. Pagina Copertina */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              1. Pagina Copertina del Menu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={getPageStyle(defaultLayout?.page)}>
              {/* Indicatore margini copertina */}
              <div style={getMarginIndicatorStyle(defaultLayout?.page)} />
              
              {/* Contenuto copertina placeholder */}
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-gray-200 rounded mb-4 flex items-center justify-center">
                  LOGO
                </div>
                <h1 className="text-4xl font-bold mb-2">Nome Ristorante</h1>
                <p className="text-xl text-gray-600">I nostri piatti del cuore</p>
              </div>
              
              {/* Badge pagina */}
              {showMargins && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
                  Copertina (Pagina 1)
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 2. Pagine Contenuto Menu */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              2. Pagine Contenuto del Menu
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Pagina 2 - Esempio contenuto */}
            <div style={getPageStyle(defaultLayout?.page)}>
              {/* Indicatore margini contenuto */}
              <div style={getMarginIndicatorStyle(defaultLayout?.page)} />
              
              {/* Contenuto menu placeholder */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-4">
                    ANTIPASTI
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Bruschetta della Casa</h3>
                        <p className="text-sm text-gray-600">
                          Pane tostato con pomodori freschi, basilico e aglio
                        </p>
                      </div>
                      <span className="font-bold">€8.00</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Antipasto Misto</h3>
                        <p className="text-sm text-gray-600">
                          Selezione di salumi e formaggi locali con miele
                        </p>
                      </div>
                      <span className="font-bold">€12.00</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-4">
                    PRIMI PIATTI
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Spaghetti alla Carbonara</h3>
                        <p className="text-sm text-gray-600">
                          Pasta con uova, pecorino, guanciale e pepe nero
                        </p>
                      </div>
                      <span className="font-bold">€14.00</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Badge pagina */}
              {showMargins && (
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded">
                  Contenuto (Pagina 2)
                </div>
              )}
            </div>

            {/* Pagina 3 - Altro esempio contenuto */}
            <div style={getPageStyle(defaultLayout?.page)}>
              {/* Indicatore margini contenuto */}
              <div style={getMarginIndicatorStyle(defaultLayout?.page)} />
              
              {/* Contenuto menu placeholder */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-4">
                    SECONDI PIATTI
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Bistecca alla Fiorentina</h3>
                        <p className="text-sm text-gray-600">
                          Bistecca di manzo con rosmarino e olio extravergine
                        </p>
                      </div>
                      <span className="font-bold">€28.00</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Branzino in Crosta</h3>
                        <p className="text-sm text-gray-600">
                          Pesce fresco cotto in crosta di sale con erbe
                        </p>
                      </div>
                      <span className="font-bold">€22.00</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-4">
                    DOLCI
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Tiramisù della Casa</h3>
                        <p className="text-sm text-gray-600">
                          Dolce tradizionale con mascarpone e caffè
                        </p>
                      </div>
                      <span className="font-bold">€7.00</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Badge pagina */}
              {showMargins && (
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded">
                  Contenuto (Pagina 3)
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 3. Pagina Allergeni */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
              3. Pagina Allergeni e Caratteristiche del Prodotto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={getPageStyle(defaultLayout?.page?.allergensMarginTop ? {
              marginTop: defaultLayout.page.allergensMarginTop,
              marginRight: defaultLayout.page.allergensMarginRight,
              marginBottom: defaultLayout.page.allergensMarginBottom,
              marginLeft: defaultLayout.page.allergensMarginLeft
            } : defaultLayout?.page)}>
              {/* Indicatore margini allergeni */}
              <div style={getMarginIndicatorStyle(defaultLayout?.page?.allergensMarginTop ? {
                marginTop: defaultLayout.page.allergensMarginTop,
                marginRight: defaultLayout.page.allergensMarginRight,
                marginBottom: defaultLayout.page.allergensMarginBottom,
                marginLeft: defaultLayout.page.allergensMarginLeft
              } : defaultLayout?.page)} />
              
              {/* Contenuto allergeni placeholder */}
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-center mb-8">
                  Informazioni sugli Allergeni
                </h1>
                
                <p className="text-center mb-6">
                  I clienti con allergie o intolleranze alimentari sono pregati di informare 
                  il personale prima dell'ordinazione. I seguenti numeri indicano i potenziali 
                  allergeni presenti nei nostri piatti:
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <span className="font-bold text-lg">1.</span>
                    <span>Glutine</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <span className="font-bold text-lg">2.</span>
                    <span>Crostacei</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <span className="font-bold text-lg">3.</span>
                    <span>Uova</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <span className="font-bold text-lg">4.</span>
                    <span>Pesce</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <span className="font-bold text-lg">5.</span>
                    <span>Arachidi</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <span className="font-bold text-lg">6.</span>
                    <span>Soia</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <span className="font-bold text-lg">7.</span>
                    <span>Latte</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <span className="font-bold text-lg">8.</span>
                    <span>Frutta a guscio</span>
                  </div>
                </div>
                
                <p className="text-sm text-center mt-6 italic">
                  Potrebbero esserci tracce di allergeni in tutti i piatti a causa 
                  della preparazione nella stessa cucina.
                </p>
              </div>
              
              {/* Badge pagina */}
              {showMargins && (
                <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 text-xs rounded">
                  Allergeni (Pagina 4)
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CSS per stampa */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-content,
          .printable-content * {
            visibility: visible;
          }
          .printable-content {
            position: absolute;
            left: 0;
            top: 0;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MenuPrint;
