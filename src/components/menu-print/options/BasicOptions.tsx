
import { SimpleLayoutSelector } from "./SimpleLayoutSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

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

const BasicOptions = ({
  language,
  setLanguage,
  layoutType,
  setLayoutType,
  printAllergens,
  setPrintAllergens,
  showPageBoundaries,
  setShowPageBoundaries,
  isLoading
}: BasicOptionsProps) => {
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  return (
    <div className="space-y-6">
      {/* Layout Selector */}
      <SimpleLayoutSelector
        selectedLayout={layoutType}
        setSelectedLayout={setLayoutType}
        isLoading={isLoading}
      />

      {/* Language Selector */}
      <div>
        <div className="text-sm font-medium mb-2">Lingua</div>
        <Select value={language} onValueChange={handleLanguageChange} disabled={isLoading}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleziona lingua" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="it">Italiano</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Toggle Options */}
      <div className="space-y-4">
        {/* Print Allergens Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="print-allergens" className="text-sm">
            Stampa pagina allergeni
          </Label>
          <Switch
            id="print-allergens"
            checked={printAllergens}
            onCheckedChange={setPrintAllergens}
            disabled={isLoading}
          />
        </div>

        {/* Show Page Boundaries Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="show-boundaries" className="text-sm">
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
