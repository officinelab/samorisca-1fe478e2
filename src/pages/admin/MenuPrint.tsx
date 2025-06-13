
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
    <div className="space-y-6">
      <MenuPrintHeader 
        showMargins={showMargins}
        setShowMargins={setShowMargins}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        currentLayout={currentLayout}
      />
      
      <MenuPrintPreview 
        currentLayout={currentLayout}
        showMargins={showMargins}
      />
    </div>
  );
};

export default MenuPrint;
