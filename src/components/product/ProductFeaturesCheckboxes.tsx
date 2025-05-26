
import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ProductFeature } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

// Funzione per confronto robusto (disaccoppiata per riutilizzo)
function arraysAreDifferent(a: string[], b: string[]) {
  if (a.length !== b.length) return true;
  const sa = [...a].sort();
  const sb = [...b].sort();
  for (let i = 0; i < sa.length; i++) {
    if (sa[i] !== sb[i]) return true;
  }
  return false;
}

interface Props {
  productId?: string;
  selectedFeatureIds: string[];
  setSelectedFeatureIds: (ids: string[]) => void;
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

  useEffect(() => {
    let mounted = true;
    const fetchFeatures = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("product_features")
        .select("*")
        .order("display_order", { ascending: true });
      if (!error && mounted) setFeatures(data || []);
      setIsLoading(false);
    };
    fetchFeatures();
    return () => { mounted = false };
  }, []);

  const handleChange = (featureId: string) => {
    let newFeatureIds: string[];
    if (selectedFeatureIds.includes(featureId)) {
      newFeatureIds = selectedFeatureIds.filter(id => id !== featureId);
    } else {
      newFeatureIds = [...selectedFeatureIds, featureId];
    }
    // Aggiorna solo se effettivamente cambia qualcosa
    if (arraysAreDifferent(selectedFeatureIds, newFeatureIds)) {
      setSelectedFeatureIds(newFeatureIds);
    }
  };

  if (isLoading || loading) {
    return <div className="text-sm text-muted-foreground">Caricamento caratteristiche...</div>;
  }

  if (features.length === 0) {
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
              selectedFeatureIds.includes(feature.id)
                ? "border-primary bg-muted/50"
                : "border-input"
            )}
            onClick={() => handleChange(feature.id)}
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
