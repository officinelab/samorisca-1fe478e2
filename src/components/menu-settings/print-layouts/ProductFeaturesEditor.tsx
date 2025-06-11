
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProductFeaturesConfig } from "@/types/printLayout";

interface ProductFeaturesEditorProps {
  config: ProductFeaturesConfig;
  onChange: (field: string, value: number) => void;
}

const ProductFeaturesEditor: React.FC<ProductFeaturesEditorProps> = ({ 
  config, 
  onChange 
}) => {
  const handleChange = (field: string, value: string) => {
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
            value={config.icon?.iconSize || 16}
            onChange={(e) => handleChange('iconSize', e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="text-xs text-gray-600 bg-white p-2 rounded border">
          <strong>Anteprima:</strong> Icone {config.icon?.iconSize || 16}px
        </div>
      </div>
    </div>
  );
};

export default ProductFeaturesEditor;
