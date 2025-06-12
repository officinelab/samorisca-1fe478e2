
import React, { useState } from 'react';
import MenuPrintHeader from '@/components/menu-print/MenuPrintHeader';
import MenuPrintPreview from '@/components/menu-print/MenuPrintPreview';
import { useMenuLayouts } from "@/hooks/useMenuLayouts";

const MenuPrint = () => {
  const [showMargins, setShowMargins] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { layouts } = useMenuLayouts();
  
  // Use the first available layout or default values
  const currentLayout = layouts?.[0];
  
  return (
    <div className="space-y-6">
      <MenuPrintHeader 
        showMargins={showMargins}
        setShowMargins={setShowMargins}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
      />
      
      <MenuPrintPreview 
        currentLayout={currentLayout}
        showMargins={showMargins}
      />
    </div>
  );
};

export default MenuPrint;
