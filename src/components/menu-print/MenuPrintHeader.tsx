import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Printer, FileDown, Eye, EyeOff, Settings, Loader2 } from "lucide-react";
import PrintLayoutsManager from "@/components/menu-settings/PrintLayoutsManager";
import { usePdfExport } from "@/hooks/print/usePdfExport";
import { PrintLayout } from "@/types/printLayout";

interface MenuPrintHeaderProps {
  showMargins: boolean;
  setShowMargins: (show: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  currentLayout?: PrintLayout;
  menuPages?: any[]; // Le pagine calcolate per il contenuto
}

const MenuPrintHeader: React.FC<MenuPrintHeaderProps> = ({
  showMargins,
  setShowMargins,
  isSettingsOpen,
  setIsSettingsOpen,
  currentLayout,
  menuPages
}) => {
  const { exportToPdf, isExporting } = usePdfExport();

  const handleExportPdf = async () => {
    console.log('🎯 Pulsante Salva PDF cliccato');
    if (currentLayout) {
      await exportToPdf({
        layout: currentLayout,
        menuPages: menuPages,
        businessInfo: {
          name: currentLayout.cover?.title?.menuTitle || "Menu",
          subtitle: currentLayout.cover?.subtitle?.menuSubtitle,
          logo: currentLayout.cover?.logo?.imageUrl
        }
      });
    } else {
      console.error('Nessun layout disponibile per l\'esportazione');
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold">Stampa Menu</h1>
          <p className="text-muted-foreground">
            Gestisci la stampa e il salvataggio del menu in formato PDF
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Impostazioni Stampa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Impostazioni Layout di Stampa</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <PrintLayoutsManager />
              </div>
            </DialogContent>
          </Dialog>
          
          <Button
            variant={showMargins ? "default" : "outline"}
            onClick={() => setShowMargins(!showMargins)}
          >
            {showMargins ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showMargins ? "Nascondi" : "Mostra"} Margini
          </Button>
          
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Stampa
          </Button>
          
          <Button 
            onClick={handleExportPdf}
            disabled={isExporting || !currentLayout || !menuPages}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4 mr-2" />
            )}
            {isExporting ? 'Generazione...' : 'Salva PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuPrintHeader;