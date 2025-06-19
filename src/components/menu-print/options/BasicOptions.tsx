
import React from 'react';
import LayoutSelector from './LayoutSelector';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicOptionsProps {
  language: string;
  setLanguage: (language: string) => void;
  layoutId: string;
  setLayoutId: (layoutId: string) => void;
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
  layoutId,
  setLayoutId,
  printAllergens,
  setPrintAllergens,
  showPageBoundaries,
  setShowPageBoundaries,
  isLoading,
}) => {
  return (
    <div className="space-y-6">
      <LayoutSelector
        selectedLayoutId={layoutId}
        setSelectedLayoutId={setLayoutId}
      />

      <div className="space-y-4">
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
