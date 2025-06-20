
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, EyeOff, Settings, Printer } from "lucide-react";
import PrintLayoutsManager from "@/components/menu-settings/PrintLayoutsManager";
import { useAdvancedPrint } from "@/hooks/print/useAdvancedPrint";
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
  const { printMenuContent } = useAdvancedPrint();

  const handleAdvancedPrint = () => {
    console.log('🖨️ Pulsante Stampa Menu cliccato - sistema finestra popup');
    printMenuContent();
  };

  return (
    <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold">Stampa Menu</h1>
          <p className="text-muted-foreground">
            Gestisci la stampa del menu
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
          
          <Button variant="default" onClick={handleAdvancedPrint}>
            <Printer className="w-4 h-4 mr-2" />
            Stampa Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuPrintHeader;
