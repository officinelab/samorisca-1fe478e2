
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

  // Nuova versione robusta
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

