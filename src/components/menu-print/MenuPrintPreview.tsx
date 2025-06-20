import React from 'react';
import CoverPages from './CoverPages';
import MenuContentPages from './MenuContentPages';
import AllergensPages from './AllergensPages';
import { PrintLayout } from '@/types/printLayout';

interface MenuPrintPreviewProps {
  currentLayout?: PrintLayout;
  showMargins: boolean;
  refreshKey?: number;
}

const MenuPrintPreview: React.FC<MenuPrintPreviewProps> = ({
  currentLayout,
  showMargins,
  refreshKey = 0
}) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-none">
      <div className="space-y-8">
        {/* Cover pages */}
        <CoverPages 
          showMargins={showMargins} 
          currentLayout={currentLayout}
          refreshKey={refreshKey}
        />
        
        {/* Menu content pages */}
        <MenuContentPages 
          showMargins={showMargins}
          layoutRefreshKey={refreshKey}
        />

        {/* Allergens and Product Features Page */}
        <AllergensPages 
          showMargins={showMargins}
          activeLayout={currentLayout}
          layoutRefreshKey={refreshKey}
        />
      </div>
    </div>
  );
};

export default MenuPrintPreview;
