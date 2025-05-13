
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FontStyle, PrintLayoutElementConfig } from "@/types/printLayout";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ElementEditorProps {
  title: string;
  elementConfig: PrintLayoutElementConfig;
  onChange: (property: keyof PrintLayoutElementConfig, value: any) => void;
  onMarginChange: (marginKey: keyof PrintLayoutElementConfig['margin'], value: number) => void;
}

export const ElementEditor: React.FC<ElementEditorProps> = ({
  title,
  elementConfig,
  onChange,
  onMarginChange,
}) => {
  // Arrotonda a 1 decimale
  const roundToOneDecimal = (value: number) => {
    return Math.round(value * 10) / 10;
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor={`${title}-visible`} className="font-medium">
              {title}
            </Label>
            <Switch
              id={`${title}-visible`}
              checked={elementConfig.visible}
              onCheckedChange={(checked) => onChange("visible", checked)}
            />
          </div>

          {elementConfig.visible && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${title}-fontFamily`}>Carattere</Label>
                  <Select
                    value={elementConfig.fontFamily}
                    onValueChange={(value) => onChange("fontFamily", value)}
                  >
                    <SelectTrigger id={`${title}-fontFamily`}>
                      <SelectValue placeholder="Seleziona carattere" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Courier">Courier</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Impact">Impact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${title}-fontSize`}>
                    Dimensione: {elementConfig.fontSize}pt
                  </Label>
                  <Slider
                    id={`${title}-fontSize`}
                    min={6}
                    max={36}
                    step={1}
                    value={[elementConfig.fontSize]}
                    onValueChange={(value) => onChange("fontSize", value[0])}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${title}-fontStyle`}>Stile carattere</Label>
                  <Select
                    value={elementConfig.fontStyle}
                    onValueChange={(value) => onChange("fontStyle", value as FontStyle)}
                  >
                    <SelectTrigger id={`${title}-fontStyle`}>
                      <SelectValue placeholder="Seleziona stile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normale</SelectItem>
                      <SelectItem value="italic">Corsivo</SelectItem>
                      <SelectItem value="bold">Grassetto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${title}-alignment`}>Allineamento</Label>
                  <Select
                    value={elementConfig.alignment}
                    onValueChange={(value) => onChange("alignment", value as 'left' | 'center' | 'right')}
                  >
                    <SelectTrigger id={`${title}-alignment`}>
                      <SelectValue placeholder="Seleziona allineamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Sinistra</SelectItem>
                      <SelectItem value="center">Centro</SelectItem>
                      <SelectItem value="right">Destra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${title}-fontColor`}>
                    Colore: {elementConfig.fontColor}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div
                          className="w-10 h-10 rounded border cursor-pointer"
                          style={{ backgroundColor: elementConfig.fontColor }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3">
                        <HexColorPicker
                          color={elementConfig.fontColor}
                          onChange={(color) => onChange("fontColor", color)}
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      id={`${title}-fontColor`}
                      value={elementConfig.fontColor}
                      onChange={(e) => onChange("fontColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${title}-lineHeight`}>
                    Interlinea: {roundToOneDecimal(elementConfig.lineHeight || 1.5)}
                  </Label>
                  <Slider
                    id={`${title}-lineHeight`}
                    min={1}
                    max={3}
                    step={0.1}
                    value={[elementConfig.lineHeight || 1.5]}
                    onValueChange={(value) => onChange("lineHeight", value[0])}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label className="mb-2 block">Margini (mm)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor={`${title}-margin-top`} className="text-xs">
                      Superiore: {elementConfig.margin.top}mm
                    </Label>
                    <Input
                      id={`${title}-margin-top`}
                      type="number"
                      min={0}
                      max={50}
                      value={elementConfig.margin.top}
                      onChange={(e) => onMarginChange("top", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`${title}-margin-right`} className="text-xs">
                      Destra: {elementConfig.margin.right}mm
                    </Label>
                    <Input
                      id={`${title}-margin-right`}
                      type="number"
                      min={0}
                      max={50}
                      value={elementConfig.margin.right}
                      onChange={(e) => onMarginChange("right", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`${title}-margin-bottom`} className="text-xs">
                      Inferiore: {elementConfig.margin.bottom}mm
                    </Label>
                    <Input
                      id={`${title}-margin-bottom`}
                      type="number"
                      min={0}
                      max={50}
                      value={elementConfig.margin.bottom}
                      onChange={(e) => onMarginChange("bottom", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`${title}-margin-left`} className="text-xs">
                      Sinistra: {elementConfig.margin.left}mm
                    </Label>
                    <Input
                      id={`${title}-margin-left`}
                      type="number"
                      min={0}
                      max={50}
                      value={elementConfig.margin.left}
                      onChange={(e) => onMarginChange("left", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ElementEditor;
