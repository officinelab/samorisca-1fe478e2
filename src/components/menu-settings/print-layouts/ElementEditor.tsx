
import { PrintLayoutElementConfig, FontStyle } from "@/types/printLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ElementEditorProps {
  element: PrintLayoutElementConfig;
  onChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  onMarginChange: (field: keyof PrintLayoutElementConfig["margin"], value: number) => void;
}

const ElementEditor = ({ element, onChange, onMarginChange }: ElementEditorProps) => {
  const fontFamilies = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Tahoma",
    "Trebuchet MS",
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="element-visible"
          checked={element.visible}
          onCheckedChange={(checked) => onChange("visible", Boolean(checked))}
        />
        <Label htmlFor="element-visible">Visibile</Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="font-family">Tipo carattere</Label>
          <Select 
            value={element.fontFamily} 
            onValueChange={(value) => onChange("fontFamily", value)}
          >
            <SelectTrigger id="font-family">
              <SelectValue placeholder="Seleziona un font" />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font} value={font}>
                  <span style={{ fontFamily: font }}>{font}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Preview del font selezionato */}
          <div 
            className="mt-2 p-2 border rounded-md"
            style={{ 
              fontFamily: element.fontFamily, 
              fontSize: `${element.fontSize}pt`,
              fontWeight: element.fontStyle === 'bold' ? 'bold' : 'normal',
              fontStyle: element.fontStyle === 'italic' ? 'italic' : 'normal',
              color: element.fontColor,
              textAlign: element.alignment as any
            }}
          >
            Anteprima del testo
          </div>
        </div>

        <div>
          <Label htmlFor="font-size">Dimensione carattere (pt)</Label>
          <Input
            id="font-size"
            type="number"
            min={6}
            value={element.fontSize}
            onChange={(e) => onChange("fontSize", parseInt(e.target.value))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="font-style">Stile carattere</Label>
        <RadioGroup
          value={element.fontStyle}
          onValueChange={(value) => onChange("fontStyle", value as FontStyle)}
          className="flex space-x-4 mt-1"
        >
          <div className="flex items-center">
            <RadioGroupItem value="normal" id="font-normal" />
            <Label htmlFor="font-normal" className="ml-2">Normale</Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="italic" id="font-italic" />
            <Label htmlFor="font-italic" className="ml-2">Corsivo</Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="bold" id="font-bold" />
            <Label htmlFor="font-bold" className="ml-2">Grassetto</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="font-color">Colore carattere</Label>
        <div className="flex items-center mt-1">
          <Input
            id="font-color"
            type="text"
            value={element.fontColor}
            onChange={(e) => onChange("fontColor", e.target.value)}
            placeholder="#000000"
          />
          <div className="ml-2 w-8 h-8 border border-gray-300 rounded" style={{ backgroundColor: element.fontColor }}></div>
        </div>
      </div>

      <div>
        <Label htmlFor="alignment">Allineamento</Label>
        <RadioGroup
          value={element.alignment}
          onValueChange={(value) => onChange("alignment", value as "left" | "center" | "right")}
          className="flex space-x-4 mt-1"
        >
          <div className="flex items-center">
            <RadioGroupItem value="left" id="align-left" />
            <Label htmlFor="align-left" className="ml-2">Sinistra</Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="center" id="align-center" />
            <Label htmlFor="align-center" className="ml-2">Centro</Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="right" id="align-right" />
            <Label htmlFor="align-right" className="ml-2">Destra</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>Margini (mm)</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
          <div>
            <Label htmlFor="margin-top" className="text-xs text-muted-foreground">Superiore</Label>
            <Input
              id="margin-top"
              type="number"
              min={0}
              value={element.margin.top}
              onChange={(e) => onMarginChange("top", parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="margin-right" className="text-xs text-muted-foreground">Destro</Label>
            <Input
              id="margin-right"
              type="number"
              min={0}
              value={element.margin.right}
              onChange={(e) => onMarginChange("right", parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="margin-bottom" className="text-xs text-muted-foreground">Inferiore</Label>
            <Input
              id="margin-bottom"
              type="number"
              min={0}
              value={element.margin.bottom}
              onChange={(e) => onMarginChange("bottom", parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="margin-left" className="text-xs text-muted-foreground">Sinistro</Label>
            <Input
              id="margin-left"
              type="number"
              min={0}
              value={element.margin.left}
              onChange={(e) => onMarginChange("left", parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementEditor;
