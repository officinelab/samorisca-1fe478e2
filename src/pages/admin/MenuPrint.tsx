import React, { useState, useEffect } from 'react';
import MenuPrintHeader from '@/components/menu-print/MenuPrintHeader';
import MenuPrintPreview from '@/components/menu-print/MenuPrintPreview';
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import { useMenuPrintLayoutSync } from "@/hooks/menu-print/useMenuPrintLayoutSync";

const MenuPrint = () => {
  const [showMargins, setShowMargins] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Chiave per forzare re-render
  const { layouts, forceRefresh, isLoading } = useMenuLayouts();
  
  // Use the first available layout or default values
  const currentLayout = layouts?.[0];
  
  // Listen for layout updates from the settings dialog
  useMenuPrintLayoutSync(() => {
    console.log('🔄 Triggering layout refresh...');
    forceRefresh(); // Ricarica i layout dal DB
    setRefreshKey(prev => prev + 1); // Forza re-render dei componenti
  });
  
  // Debug log per verificare il layout corrente
  useEffect(() => {
    console.log("MenuPrint - Layout corrente:", currentLayout);
    console.log("MenuPrint - Refresh key:", refreshKey);
    if (currentLayout) {
      console.log("MenuPrint - Layout name:", currentLayout.name);
      console.log("MenuPrint - Logo config:", currentLayout.cover?.logo);
    }
  }, [currentLayout, refreshKey]);
  
  // Mostra loading durante il refresh
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
      />
      
      <div className="pt-6">
        <MenuPrintPreview 
          currentLayout={currentLayout}
          showMargins={showMargins}
          refreshKey={refreshKey} // Passa il refreshKey
        />
      </div>
    </div>
  );
};

export default MenuPrint;