
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PrintLayoutElementConfig } from "@/types/printLayout";

interface ElementEditorProps {
  element: PrintLayoutElementConfig;
  onChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  onMarginChange?: (field: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  hideMarginControls?: boolean;
}

const ElementEditor = ({ element, onChange, onMarginChange, hideMarginControls = false }: ElementEditorProps) => {
  const fontFamilies = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", 
    "Verdana", "Courier New", "Impact", "Comic Sans MS",
    "Trebuchet MS", "Arial Black", "Palatino", "Garamond"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Font Family */}
      <div className="space-y-2">
        <Label>Font</Label>
        <Select 
          value={element.fontFamily} 
          onValueChange={(value) => onChange("fontFamily", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map(font => (
              <SelectItem key={font} value={font}>{font}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <Label>Dimensione Font (pt)</Label>
        <Input
          type="number"
          value={element.fontSize}
          onChange={(e) => onChange("fontSize", parseInt(e.target.value))}
          min="1"
          max="100"
        />
      </div>

      {/* Font Color */}
      <div className="space-y-2">
        <Label>Colore Font</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={element.fontColor}
            onChange={(e) => onChange("fontColor", e.target.value)}
            className="w-16 h-10"
          />
          <Input
            type="text"
            value={element.fontColor}
            onChange={(e) => onChange("fontColor", e.target.value)}
            placeholder="#000000"
            className="flex-1"
          />
        </div>
      </div>

      {/* Font Style */}
      <div className="space-y-2">
        <Label>Stile Font</Label>
        <Select 
          value={element.fontStyle} 
          onValueChange={(value) => onChange("fontStyle", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normale</SelectItem>
            <SelectItem value="bold">Grassetto</SelectItem>
            <SelectItem value="italic">Corsivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Text Alignment */}
      <div className="space-y-2">
        <Label>Allineamento</Label>
        <Select 
          value={element.alignment} 
          onValueChange={(value) => onChange("alignment", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Sinistra</SelectItem>
            <SelectItem value="center">Centro</SelectItem>
            <SelectItem value="right">Destra</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Margins - only show if not hidden */}
      {!hideMarginControls && onMarginChange && (
        <>
          <div className="col-span-1 md:col-span-2">
            <Label className="text-base font-semibold">Margini (mm)</Label>
          </div>
          
          <div className="space-y-2">
            <Label>Margine Superiore</Label>
            <Input
              type="number"
              value={element.margin.top}
              onChange={(e) => onMarginChange("top", parseFloat(e.target.value))}
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label>Margine Destro</Label>
            <Input
              type="number"
              value={element.margin.right}
              onChange={(e) => onMarginChange("right", parseFloat(e.target.value))}
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label>Margine Inferiore</Label>
            <Input
              type="number"
              value={element.margin.bottom}
              onChange={(e) => onMarginChange("bottom", parseFloat(e.target.value))}
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label>Margine Sinistro</Label>
            <Input
              type="number"
              value={element.margin.left}
              onChange={(e) => onMarginChange("left", parseFloat(e.target.value))}
              step="0.1"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ElementEditor;
