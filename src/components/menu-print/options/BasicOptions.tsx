
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SimpleLayoutSelector } from './SimpleLayoutSelector';

interface BasicOptionsProps {
  language: string;
  setLanguage: (language: string) => void;
  layoutType: string;
  setLayoutType: (layout: string) => void;
  printAllergens: boolean;
  setPrintAllergens: (print: boolean) => void;
  showPageBoundaries: boolean;
  setShowPageBoundaries: (show: boolean) => void;
  isLoading: boolean;
}

const BasicOptions: React.FC<BasicOptionsProps> = ({
  language,
  setLanguage,
  layoutType,
  setLayoutType,
  printAllergens,
  setPrintAllergens,
  showPageBoundaries,
  setShowPageBoundaries,
  isLoading
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="text-sm font-medium mb-2">Lingua</div>
        <Select 
          value={language} 
          onValueChange={setLanguage} 
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona lingua" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="it">Italiano</SelectItem>
            <SelectItem value="en">Inglese</SelectItem>
            <SelectItem value="de">Tedesco</SelectItem>
            <SelectItem value="fr">Francese</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <SimpleLayoutSelector 
          selectedLayout={layoutType}
          setSelectedLayout={setLayoutType}
          isLoading={isLoading}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="print-allergens"
          checked={printAllergens}
          onCheckedChange={setPrintAllergens}
          disabled={isLoading}
        />
        <Label htmlFor="print-allergens">Includi pagina allergeni</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="page-boundaries"
          checked={showPageBoundaries}
          onCheckedChange={setShowPageBoundaries}
          disabled={isLoading}
        />
        <Label htmlFor="page-boundaries">Mostra bordi pagina</Label>
      </div>
    </div>
  );
};

export default BasicOptions;
