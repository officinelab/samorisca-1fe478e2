
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProductFeaturesConfig } from "@/types/printLayout";

interface ProductFeaturesEditorProps {
  config: ProductFeaturesConfig;
  onChange: (field: keyof ProductFeaturesConfig, value: number) => void;
}

const ProductFeaturesEditor: React.FC<ProductFeaturesEditorProps> = ({ 
  config, 
  onChange 
}) => {
  const handleChange = (field: keyof ProductFeaturesConfig, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    onChange(field, numValue);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <h4 className="font-medium text-sm text-gray-900">Configurazione Icone Caratteristiche</h4>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="iconSize" className="text-xs font-medium">
            Grandezza icone (px)
          </Label>
          <Input
            id="iconSize"
            type="number"
            min="8"
            max="48"
            value={config.iconSize}
            onChange={(e) => handleChange('iconSize', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="iconSpacing" className="text-xs font-medium">
            Spaziatura tra icone (px)
          </Label>
          <Input
            id="iconSpacing"
            type="number"
            min="0"
            max="32"
            value={config.iconSpacing}
            onChange={(e) => handleChange('iconSpacing', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="marginTop" className="text-xs font-medium">
            Margine superiore (px)
          </Label>
          <Input
            id="marginTop"
            type="number"
            min="0"
            max="32"
            value={config.marginTop}
            onChange={(e) => handleChange('marginTop', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="marginBottom" className="text-xs font-medium">
            Margine inferiore (px)
          </Label>
          <Input
            id="marginBottom"
            type="number"
            min="0"
            max="32"
            value={config.marginBottom}
            onChange={(e) => handleChange('marginBottom', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="text-xs text-gray-600 bg-white p-2 rounded border">
        <strong>Anteprima:</strong> Icone {config.iconSize}px, spaziatura {config.iconSpacing}px, 
        margini {config.marginTop}px/{config.marginBottom}px
      </div>
    </div>
  );
};

export default ProductFeaturesEditor;
