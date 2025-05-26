
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useProductFeaturesCheckboxes } from "@/hooks/products/useProductFeaturesCheckboxes";

interface Props {
  productId?: string;
  selectedFeatureIds: string[];
  toggleFeature: (id: string) => void;
  loading: boolean;
}

const ProductFeaturesCheckboxes: React.FC<Props> = ({
  productId,
  selectedFeatureIds,
  toggleFeature,
  loading,
}) => {
  const { features } = useProductFeaturesCheckboxes(productId);

  return (
    <div>
      <Label className="block text-xs mb-2">Caratteristiche</Label>
      {loading ? (
        <div className="text-sm text-muted-foreground">Caricamento caratteristiche...</div>
      ) : features.length === 0 ? (
        <div className="text-sm text-muted-foreground">Nessuna caratteristica disponibile</div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={cn(
                "flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
                selectedFeatureIds.includes(feature.id) ? "border-primary bg-muted/50" : "border-input"
              )}
              onClick={() => toggleFeature(feature.id)}
            >
              <Checkbox
                checked={selectedFeatureIds.includes(feature.id)}
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
