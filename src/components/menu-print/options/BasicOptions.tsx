
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LayoutSelector } from "./LayoutSelector";

interface BasicOptionsProps {
  language: string;
  setLanguage: (language: string) => void;
  selectedLayout: string;
  setSelectedLayout: (layout: string) => void;
  printAllergens: boolean;
  setPrintAllergens: (print: boolean) => void;
  showPageBoundaries: boolean;
  setShowPageBoundaries: (show: boolean) => void;
}

export const BasicOptions = ({
  language,
  setLanguage,
  selectedLayout,
  setSelectedLayout,
  printAllergens,
  setPrintAllergens,
  showPageBoundaries,
  setShowPageBoundaries,
}: BasicOptionsProps) => {
  return (
    <div className="space-y-4 pt-4">
      <div>
        <div className="text-sm font-medium mb-2">Lingua</div>
        <RadioGroup value={language} onValueChange={setLanguage} className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="it" id="r1" />
            <Label htmlFor="r1">Italiano</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="en" id="r2" />
            <Label htmlFor="r2">Inglese</Label>
          </div>
        </RadioGroup>
      </div>

      <LayoutSelector 
        selectedLayout={selectedLayout} 
        setSelectedLayout={setSelectedLayout} 
      />

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium">Stampa allergeni</span>
          <span className="text-sm text-gray-500">Aggiunge una pagina con la legenda degli allergeni</span>
        </div>
        <Switch 
          checked={printAllergens} 
          onCheckedChange={setPrintAllergens} 
          id="print-allergens" 
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium">Mostra bordi pagina</span>
          <span className="text-sm text-gray-500">Visualizza i bordi delle pagine nell'anteprima</span>
        </div>
        <Switch 
          checked={showPageBoundaries} 
          onCheckedChange={setShowPageBoundaries} 
          id="show-boundaries" 
        />
      </div>
    </div>
  );
};
