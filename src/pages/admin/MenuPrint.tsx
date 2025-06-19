
import React, { useState, useEffect } from 'react';
import MenuPrintHeader from '@/components/menu-print/MenuPrintHeader';
import MenuPrintPreview from '@/components/menu-print/MenuPrintPreview';
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import { useMenuPrintLayoutSync } from "@/hooks/menu-print/useMenuPrintLayoutSync";

const MenuPrint = () => {
  const [showMargins, setShowMargins] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [calculatedMenuPages, setCalculatedMenuPages] = useState<any[]>([]);
  const { layouts, forceRefresh, isLoading } = useMenuLayouts();
  
  const currentLayout = layouts?.[0];
  
  useMenuPrintLayoutSync(() => {
    console.log('🔄 Triggering layout refresh...');
    forceRefresh();
    setRefreshKey(prev => prev + 1);
    setCalculatedMenuPages([]);
  });
  
  useEffect(() => {
    console.log("MenuPrint - Layout corrente:", currentLayout);
    console.log("MenuPrint - Refresh key:", refreshKey);
    console.log("MenuPrint - Pagine calcolate:", calculatedMenuPages.length);
    if (currentLayout) {
      console.log("MenuPrint - Layout name:", currentLayout.name);
      console.log("MenuPrint - Logo config:", currentLayout.cover?.logo);
    }
  }, [currentLayout, refreshKey, calculatedMenuPages]);

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
        menuPages={calculatedMenuPages}
      />
      
      <div className="pt-6">
        <MenuPrintPreview 
          currentLayout={currentLayout}
          showMargins={showMargins}
          refreshKey={refreshKey}
          onMenuPagesCalculated={handleMenuPagesCalculated}
        />
      </div>
    </div>
  );
};

export default MenuPrint;
