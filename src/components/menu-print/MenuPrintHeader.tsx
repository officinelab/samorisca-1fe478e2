// 1. Modifica MenuContentPages.tsx per esporre le pagine calcolate
// Aggiungi questa interface all'inizio del file:

interface MenuContentPagesProps {
  showMargins: boolean;
  layoutRefreshKey?: number;
  onPagesCalculated?: (pages: any[]) => void; // Callback per notificare le pagine calcolate
}

// Nel componente MenuContentPages, modifica la dichiarazione per includere la nuova prop:
const MenuContentPages: React.FC<MenuContentPagesProps> = ({ 
  showMargins, 
  layoutRefreshKey = 0,
  onPagesCalculated 
}) => {
  // ... resto del codice esistente ...

  // Dopo la riga "const pages = createPages();" aggiungi:
  useEffect(() => {
    if (!isLoading && pages && pages.length > 0 && onPagesCalculated) {
      console.log('📄 MenuContentPages: Notifica pagine calcolate:', pages.length);
      onPagesCalculated(pages);
    }
  }, [pages, isLoading, onPagesCalculated]);

  // ... resto del componente ...
};

// 2. Modifica MenuPrintPreview.tsx per ricevere e propagare le pagine
interface MenuPrintPreviewProps {
  currentLayout?: PrintLayout;
  showMargins: boolean;
  refreshKey?: number;
  onMenuPagesCalculated?: (pages: any[]) => void; // Aggiungi questa prop
}

const MenuPrintPreview: React.FC<MenuPrintPreviewProps> = ({
  currentLayout,
  showMargins,
  refreshKey = 0,
  onMenuPagesCalculated // Aggiungi qui
}) => {
  // ... resto del codice esistente ...

  // Nel return, passa la callback a MenuContentPages:
  {/* Menu Content Pages - Passa il refreshKey */}
  <MenuContentPages 
    showMargins={showMargins} 
    layoutRefreshKey={refreshKey}
    onPagesCalculated={onMenuPagesCalculated} // Aggiungi questa riga
  />
  
  // ... resto del componente ...
};

// 3. Modifica MenuPrint.tsx (il componente principale)
import React, { useState, useEffect } from 'react';
import MenuPrintHeader from '@/components/menu-print/MenuPrintHeader';
import MenuPrintPreview from '@/components/menu-print/MenuPrintPreview';
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import { useMenuPrintLayoutSync } from "@/hooks/menu-print/useMenuPrintLayoutSync";

const MenuPrint = () => {
  const [showMargins, setShowMargins] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [calculatedMenuPages, setCalculatedMenuPages] = useState<any[]>([]); // Nuovo stato per le pagine
  const { layouts, forceRefresh, isLoading } = useMenuLayouts();
  
  const currentLayout = layouts?.[0];
  
  useMenuPrintLayoutSync(() => {
    console.log('🔄 Triggering layout refresh...');
    forceRefresh();
    setRefreshKey(prev => prev + 1);
    setCalculatedMenuPages([]); // Reset delle pagine quando cambia il layout
  });
  
  useEffect(() => {
    console.log("MenuPrint - Layout corrente:", currentLayout);
    console.log("MenuPrint - Refresh key:", refreshKey);
    console.log("MenuPrint - Pagine calcolate:", calculatedMenuPages.length); // Debug
    if (currentLayout) {
      console.log("MenuPrint - Layout name:", currentLayout.name);
      console.log("MenuPrint - Logo config:", currentLayout.cover?.logo);
    }
  }, [currentLayout, refreshKey, calculatedMenuPages]);

  // Callback per ricevere le pagine calcolate
  const handleMenuPagesCalculated = (pages: any[]) => {
    console.log('📄 MenuPrint: Ricevute pagine calcolate:', pages.length);
    setCalculatedMenuPages(pages);
  };
  
  if (isLoading && refreshKey > 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Aggiornamento layout in corso...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <MenuPrintHeader 
        showMargins={showMargins}
        setShowMargins={setShowMargins}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        currentLayout={currentLayout}
        menuPages={calculatedMenuPages} // Passa le pagine calcolate
      />
      
      <div className="pt-6">
        <MenuPrintPreview 
          currentLayout={currentLayout}
          showMargins={showMargins}
          refreshKey={refreshKey}
          onMenuPagesCalculated={handleMenuPagesCalculated} // Passa la callback
        />
      </div>
    </div>
  );
};

export default MenuPrint;

// 4. Aggiorna MenuPrintHeader per gestire meglio il caso di pagine non ancora calcolate
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