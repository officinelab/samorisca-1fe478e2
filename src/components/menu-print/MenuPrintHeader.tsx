
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileDown, Eye, EyeOff, Settings, Loader2, Printer } from "lucide-react";
import PrintLayoutsManager from "@/components/menu-settings/PrintLayoutsManager";
import { usePdfExport } from "@/hooks/print/usePdfExport";
import { useBrowserPrint } from "@/hooks/print/useBrowserPrint";
import { PrintLayout } from "@/types/printLayout";

interface MenuPrintHeaderProps {
  showMargins: boolean;
  setShowMargins: (show: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  currentLayout?: PrintLayout;
}

const MenuPrintHeader: React.FC<MenuPrintHeaderProps> = ({
  showMargins,
  setShowMargins,
  isSettingsOpen,
  setIsSettingsOpen,
  currentLayout
}) => {
  const { exportToPdf, isExporting } = usePdfExport();
  const { printMenuContent } = useBrowserPrint();

  const handleExportPdf = async () => {
    console.log('🎯 Pulsante Salva PDF cliccato - nuovo sistema');
    if (currentLayout) {
      await exportToPdf(currentLayout);
    } else {
      console.error('Nessun layout disponibile per l\'esportazione');
    }
  };

  const handlePrint = () => {
    console.log('🖨️ Pulsante Stampa cliccato - nuovo sistema');
    printMenuContent();
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
          
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Stampa Menu
          </Button>
          
          <Button 
            onClick={handleExportPdf}
            disabled={isExporting || !currentLayout}
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
