
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import RestaurantLogoUploader from "./options/RestaurantLogoUploader";
import LanguageSelector from "./options/LanguageSelector";
import LayoutSelector from "./options/LayoutSelector";
import { Separator } from "@/components/ui/separator";
import SafetyMarginSettings from "./options/SafetyMarginSettings";

interface OptionsPanelProps {
  restaurantLogo: string | null;
  updateRestaurantLogo: (logoUrl: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  layoutId: string;
  setLayoutId: (layoutId: string) => void;
  showPageBoundaries: boolean;
  setShowPageBoundaries: (show: boolean) => void;
  isLoading: boolean;
  forceLayoutRefresh: () => void;
  safetyMargin?: {
    vertical: number;
    horizontal: number;
  };
  onMarginChange?: (type: 'vertical' | 'horizontal', value: number) => void;
}

const OptionsPanel: React.FC<OptionsPanelProps> = ({
  restaurantLogo,
  updateRestaurantLogo,
  language,
  setLanguage,
  layoutId,
  setLayoutId,
  showPageBoundaries,
  setShowPageBoundaries,
  isLoading,
  forceLayoutRefresh,
  safetyMargin = { vertical: 8, horizontal: 3 },
  onMarginChange
}) => {
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Opzioni Stampa</h3>
        
        {/* Logo uploader */}
        <RestaurantLogoUploader
          restaurantLogo={restaurantLogo}
          updateRestaurantLogo={updateRestaurantLogo}
        />
      </div>

      <Separator />

      {/* Selettori */}
      <div className="space-y-4">
        <LanguageSelector 
          language={language} 
          setLanguage={setLanguage}
        />
        
        <LayoutSelector 
          layoutId={layoutId}
          setLayoutId={setLayoutId}
          isLoading={isLoading}
          forceLayoutRefresh={forceLayoutRefresh}
          showPageBoundaries={showPageBoundaries}
          setShowPageBoundaries={setShowPageBoundaries}
        />
        
        {/* Impostazioni margini di sicurezza */}
        {onMarginChange && (
          <SafetyMarginSettings 
            safetyMargin={safetyMargin}
            onMarginChange={onMarginChange}
          />
        )}
      </div>
      
      <Separator />
      
      {/* Print button */}
      <Button 
        onClick={handlePrint} 
        className="w-full flex items-center justify-center"
      >
        <Printer className="mr-2 h-4 w-4" />
        Stampa Menu
      </Button>
    </div>
  );
};

export default OptionsPanel;
