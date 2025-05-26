
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ProductFeature } from "@/types/database";

interface Props {
  productId?: string;
  features: ProductFeature[]; // ✅ RICEVUTO DAL PARENT
  selectedFeatureIds: string[];
  setSelectedFeatureIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  loading: boolean;
}

const ProductFeaturesCheckboxes: React.FC<Props> = ({
  productId,
  features, // ✅ NON PIÙ FETCH INTERNO!
  selectedFeatureIds,
  setSelectedFeatureIds,
  loading,
}) => {
  // ❌ RIMOSSO: useEffect per fetch features
  // ❌ RIMOSSO: useState per features locali
  // ❌ RIMOSSO: isLoading locale

  // ✅ GESTIONE SEMPLICE E SICURA
  const handleChange = (featureId: string) => {
    setSelectedFeatureIds(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  // ✅ PROTEZIONE ULTERIORE: solo se l'array è reale
  if (!Array.isArray(selectedFeatureIds)) {
    console.warn("selectedFeatureIds non è un array:", selectedFeatureIds);
    return null;
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Caricamento caratteristiche...</div>;
  }

  if (!Array.isArray(features) || features.length === 0) {
    return <div className="text-sm text-muted-foreground">Nessuna caratteristica disponibile</div>;
  }

  return (
    <div>
      <Label className="block text-xs mb-2">Caratteristiche</Label>
      <div className="grid grid-cols-2 gap-2">
        {features.map((feature) => {
          const checked = selectedFeatureIds.includes(feature.id);
          return (
            <div
              key={feature.id}
              className={cn(
                "flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
                checked ? "border-primary bg-muted/50" : "border-input"
              )}
              onClick={() => handleChange(feature.id)}
              tabIndex={0}
              role="button"
              aria-pressed={checked}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => handleChange(feature.id)}
              />
              <span className="text-sm">{feature.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductFeaturesCheckboxes;