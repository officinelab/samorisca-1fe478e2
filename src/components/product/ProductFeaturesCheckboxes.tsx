
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
  // Protezione ulteriore: solo se l'array è reale
  if (!Array.isArray(selectedFeatureIds)) return null;

  if (loading) {
    return <div className="text-sm text-muted-foreground">Caricamento caratteristiche...</div>;
  }
  if (!Array.isArray(features) || features.length === 0) {
    return <div className="text-sm text-muted-foreground">Nessuna caratteristica disponibile</div>;
  }

  // Gestione robusta del cambio di selezione, forma funzionale
  const handleChange = (featureId: string) => {
    setSelectedFeatureIds(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  return (
    <div>
      <Label className="block text-xs mb-2">Caratteristiche</Label>
      <div className="grid grid-cols-2 gap-2">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={cn(
              "flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
              selectedFeatureIds.includes(feature.id)
                ? "border-primary bg-muted/50"
                : "border-input"
            )}
            onClick={() => handleChange(feature.id)}
            tabIndex={0}
            role="button"
            aria-pressed={selectedFeatureIds.includes(feature.id)}
          >
            <Checkbox
              checked={selectedFeatureIds.includes(feature.id)}
              onCheckedChange={() => handleChange(feature.id)}
            />
            <span className="text-sm">{feature.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFeaturesCheckboxes;
