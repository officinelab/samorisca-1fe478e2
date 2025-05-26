
import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ProductFeature } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  productId?: string;
  selectedFeatureIds: string[];
  setSelectedFeatureIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  loading: boolean;
}

const ProductFeaturesCheckboxes: React.FC<Props> = ({
  productId,
  selectedFeatureIds,
  setSelectedFeatureIds,
  loading,
}) => {
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch delle caratteristiche all'avvio
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    supabase
      .from("product_features")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && mounted) setFeatures(data || []);
        setIsLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  // Gestione robusta del cambio di selezione, forma funzionale
  const handleChange = (featureId: string) => {
    setSelectedFeatureIds(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  if (isLoading || loading) {
    return <div className="text-sm text-muted-foreground">Caricamento caratteristiche...</div>;
  }
  if (!Array.isArray(features) || features.length === 0) {
    return <div className="text-sm text-muted-foreground">Nessuna caratteristica disponibile</div>;
  }

  return (
    <div>
      <Label className="block text-xs mb-2">Caratteristiche</Label>
      <div className="grid grid-cols-2 gap-2">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={cn(
              "flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
              Array.isArray(selectedFeatureIds) && selectedFeatureIds.includes(feature.id)
                ? "border-primary bg-muted/50"
                : "border-input"
            )}
            onClick={() => handleChange(feature.id)}
            tabIndex={0}
            role="button"
            aria-pressed={Array.isArray(selectedFeatureIds) && selectedFeatureIds.includes(feature.id)}
          >
            <Checkbox
              checked={Array.isArray(selectedFeatureIds) && selectedFeatureIds.includes(feature.id)}
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
