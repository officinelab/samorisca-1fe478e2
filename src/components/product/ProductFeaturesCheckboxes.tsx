
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ProductFeature } from "@/types/database";

interface Props {
  features: ProductFeature[];
  selectedFeatureIds: string[];
  setSelectedFeatureIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  loading: boolean;
}

const ProductFeaturesCheckboxes: React.FC<Props> = ({
  features,
  selectedFeatureIds,
  setSelectedFeatureIds,
  loading,
}) => {
  if (!Array.isArray(selectedFeatureIds)) return null;

  if (loading) {
    return <div className="text-sm text-muted-foreground">Caricamento caratteristiche...</div>;
  }
  if (!Array.isArray(features) || features.length === 0) {
    return <div className="text-sm text-muted-foreground">Nessuna caratteristica disponibile</div>;
  }

  const handleChange = (featureId: string, checked: boolean) => {
    setSelectedFeatureIds(prev => {
      if (checked) {
        return prev.includes(featureId) ? prev : [...prev, featureId];
      } else {
        return prev.filter(id => id !== featureId);
      }
    });
  };

  return (
    <div>
      <Label className="block text-xs mb-2">Caratteristiche</Label>
      <div className="grid grid-cols-2 gap-2">
        {features.map((feature) => (
          <label
            key={feature.id}
            className={cn(
              "flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
              selectedFeatureIds.includes(feature.id)
                ? "border-primary bg-muted/50"
                : "border-input"
            )}
          >
            <Checkbox
              checked={selectedFeatureIds.includes(feature.id)}
              onCheckedChange={(checked) => handleChange(feature.id, checked as boolean)}
            />
            <span className="text-sm">{feature.title}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ProductFeaturesCheckboxes;