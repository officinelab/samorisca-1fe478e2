
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicOptionsProps {
  language: string;
  setLanguage: (language: string) => void;
  printAllergens: boolean;
  setPrintAllergens: (print: boolean) => void;
  showPageBoundaries: boolean;
  setShowPageBoundaries: (show: boolean) => void;
  isLoading: boolean;
  restaurantLogo: string | null;
  updateRestaurantLogo: (newLogo: string | null) => void;
}

const BasicOptions = ({
  language,
  setLanguage,
  printAllergens,
  setPrintAllergens,
  showPageBoundaries,
  setShowPageBoundaries,
  isLoading
}: BasicOptionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Selezione Lingua */}
      <div className="space-y-2">
        <Label htmlFor="language-select" className="text-sm font-medium">
          Lingua
        </Label>
        <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
          <SelectTrigger id="language-select">
            <SelectValue placeholder="Seleziona lingua" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="it">Italiano</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="es">Español</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Opzioni Stampa */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="print-allergens"
            checked={printAllergens}
            onCheckedChange={setPrintAllergens}
            disabled={isLoading}
          />
          <Label htmlFor="print-allergens" className="text-sm font-medium">
            Includi pagina allergeni
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="show-boundaries"
            checked={showPageBoundaries}
            onCheckedChange={setShowPageBoundaries}
            disabled={isLoading}
          />
          <Label htmlFor="show-boundaries" className="text-sm font-medium">
            Mostra margini pagina
          </Label>
        </div>
      </div>
    </div>
  );
};

export default BasicOptions;
