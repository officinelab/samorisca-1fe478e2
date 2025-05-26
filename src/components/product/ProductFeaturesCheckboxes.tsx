
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ProductFeature } from "@/types/database";

interface Props {
  productId?: string;
  features: ProductFeature[];
  selectedFeatureIds: string[];
  toggleFeature: (id: string) => void;
  loading: boolean;
}

const ProductFeaturesCheckboxes: React.FC<Props> = ({
  productId,
  features,
  selectedFeatureIds,
  toggleFeature,
  loading,
}) => {
  const safeFeatures = Array.isArray(features) ? features : [];
  const safeSelectedFeatureIds = Array.isArray(selectedFeatureIds) ? selectedFeatureIds : [];

  if (!Array.isArray(features)) {
    console.warn("ProductFeaturesCheckboxes: features non è un array!", features);
  }
  if (!Array.isArray(selectedFeatureIds)) {
    console.warn("ProductFeaturesCheckboxes: selectedFeatureIds non è un array!", selectedFeatureIds);
  }

  console.log("ProductFeaturesCheckboxes - features", safeFeatures);
  console.log("ProductFeaturesCheckboxes - selectedFeatureIds", safeSelectedFeatureIds);

  return (
    <div>
      <Label className="block text-xs mb-2">Caratteristiche</Label>
      {loading ? (
        <div className="text-sm text-muted-foreground">Caricamento caratteristiche...</div>
      ) : safeFeatures.length === 0 ? (
        <div className="text-sm text-muted-foreground">Nessuna caratteristica disponibile</div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {safeFeatures.map((feature) => (
            <div
              key={feature.id}
              className={cn(
                "flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
                safeSelectedFeatureIds.includes(feature.id) ? "border-primary bg-muted/50" : "border-input"
              )}
              onClick={() => toggleFeature(feature.id)}
            >
              <Checkbox
                checked={safeSelectedFeatureIds.includes(feature.id)}
                onCheckedChange={() => toggleFeature(feature.id)}
              />
              <span className="text-sm">{feature.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductFeaturesCheckboxes;
