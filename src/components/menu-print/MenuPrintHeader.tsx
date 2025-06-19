
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, Download, Eye, EyeOff } from "lucide-react";
import { PrintLayout } from "@/types/printLayout";
import { toast } from "@/components/ui/sonner";
import { usePdfExport } from "@/hooks/print/usePdfExport";

interface MenuPrintHeaderProps {
  showMargins: boolean;
  setShowMargins: (show: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  currentLayout?: PrintLayout;
  menuPages?: any[];
}

const MenuPrintHeader: React.FC<MenuPrintHeaderProps> = ({
  showMargins,
  setShowMargins,
  isSettingsOpen,
  setIsSettingsOpen,
  currentLayout,
  menuPages = []
}) => {
  const { exportToPdf, isExporting } = usePdfExport();

  const handleExportPdf = async () => {
    console.log('🎯 Pulsante Salva PDF cliccato');
    if (currentLayout && menuPages && menuPages.length > 0) {
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
      console.error('Layout o pagine non disponibili:', {
        hasLayout: !!currentLayout,
        pagesCount: menuPages?.length || 0
      });
      if (!menuPages || menuPages.length === 0) {
        toast.error('Attendere il caricamento delle pagine prima di esportare');
      }
    }
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Anteprima Stampa Menu</h1>
            {currentLayout && (
              <span className="text-sm text-muted-foreground">
                Layout: {currentLayout.name}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMargins(!showMargins)}
              className="flex items-center gap-2"
            >
              {showMargins ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showMargins ? 'Nascondi Margini' : 'Mostra Margini'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Impostazioni
            </Button>
            
            <Button
              onClick={handleExportPdf}
              disabled={isExporting || !currentLayout || menuPages.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Generazione...' : 'Salva PDF'}
            </Button>
          </div>
        </div>
        
        {menuPages.length === 0 && (
          <div className="mt-2 text-sm text-yellow-600">
            Attendere il caricamento delle pagine del menu...
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPrintHeader;
