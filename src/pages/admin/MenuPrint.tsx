
import React, { useState, useEffect } from 'react';
import MenuPrintHeader from '@/components/menu-print/MenuPrintHeader';
import MenuPrintPreview from '@/components/menu-print/MenuPrintPreview';
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import { useMenuPrintLayoutSync } from "@/hooks/menu-print/useMenuPrintLayoutSync";

const MenuPrint = () => {
  const [showMargins, setShowMargins] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { layouts, forceRefresh } = useMenuLayouts();
  
  // Use the first available layout or default values
  const currentLayout = layouts?.[0];
  
  // Listen for layout updates from the settings dialog
  useMenuPrintLayoutSync(forceRefresh);
  
  // Debug log per verificare il layout corrente
  useEffect(() => {
    console.log("MenuPrint - Layout corrente:", currentLayout);
    console.log("MenuPrint - Logo config:", currentLayout?.cover?.logo);
  }, [currentLayout]);
  
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
        />
      </div>
    </div>
  );
};

export default MenuPrint;
