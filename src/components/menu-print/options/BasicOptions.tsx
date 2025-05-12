
import React from 'react';
import LayoutSelector from './LayoutSelector';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RestaurantLogoUploader from '../RestaurantLogoUploader';

interface BasicOptionsProps {
  language: string;
  setLanguage: (language: string) => void;
  layoutId: string; // Cambiato da layoutType a layoutId
  setLayoutId: (layoutId: string) => void; // Cambiato da setLayoutType a setLayoutId
  printAllergens: boolean;
  setPrintAllergens: (print: boolean) => void;
  showPageBoundaries: boolean;
  setShowPageBoundaries: (show: boolean) => void;
  restaurantLogo: string | null;
  updateRestaurantLogo: (logo: string | null) => void;
  isLoading: boolean;
}

const BasicOptions: React.FC<BasicOptionsProps> = ({
  language,
  setLanguage,
  layoutId, // Cambiato da layoutType a layoutId
  setLayoutId, // Cambiato da setLayoutType a setLayoutId
  printAllergens,
  setPrintAllergens,
  showPageBoundaries,
  setShowPageBoundaries,
  restaurantLogo,
  updateRestaurantLogo,
  isLoading,
}) => {
  return (
    <div className="space-y-6">
      <LayoutSelector
        selectedLayoutId={layoutId} // Cambiato da selectedLayout a selectedLayoutId
        setSelectedLayoutId={setLayoutId} // Cambiato da setSelectedLayout a setSelectedLayoutId
      />

      <div className="space-y-4">
        <div>
          <Label htmlFor="restaurant-logo" className="text-sm font-medium block mb-2">
            Logo Ristorante
          </Label>
          <RestaurantLogoUploader
            currentLogo={restaurantLogo}
            onLogoUploaded={updateRestaurantLogo}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="language" className="text-sm font-medium">
            Lingua
          </Label>
          <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Lingua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="it">Italiano</SelectItem>
              <SelectItem value="en">Inglese</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="print-allergens" className="text-sm font-medium">
            Includi pagina allergeni
          </Label>
          <Switch
            id="print-allergens"
            checked={printAllergens}
            onCheckedChange={setPrintAllergens}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-boundaries" className="text-sm font-medium">
            Mostra bordi pagina
          </Label>
          <Switch
            id="show-boundaries"
            checked={showPageBoundaries}
            onCheckedChange={setShowPageBoundaries}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicOptions;
