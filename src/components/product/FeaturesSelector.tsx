
import React, { useEffect, useRef } from "react";
import { ProductFeature } from "@/types/database";
import CollapsibleSection from "@/components/dashboard/CollapsibleSection";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface FeaturesSelectorProps {
  selectedFeatureIds: string[];
  onChange: (featureIds: string[]) => void;
}

const areEqualArr = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const sA = [...a].sort();
  const sB = [...b].sort();
  return sA.every((val, idx) => val === sB[idx]);
};

const FeaturesSelector: React.FC<FeaturesSelectorProps> = ({
  selectedFeatureIds,
  onChange,
}) => {
  const [features, setFeatures] = React.useState<ProductFeature[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<Set<string>>(new Set(selectedFeatureIds));

  useEffect(() => {
    const fetchFeatures = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("product_features")
          .select("*")
          .order("display_order", { ascending: true });

        if (error) throw error;
        setFeatures(data || []);
      } catch (error) {
        console.error("Errore nel caricamento delle caratteristiche:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  // Aggiorna solo su vero cambio prop
  useEffect(() => {
    setSelected((prev) => {
      const newSet = new Set(selectedFeatureIds);
      if (areEqualArr(Array.from(prev), selectedFeatureIds)) {
        return prev; // Evita inutile update
      }
      return newSet;
    });
  }, [selectedFeatureIds]);

  // Chiamata onChange SOLO su interazione utente
  const handleUserToggle = (featureId: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(featureId)) {
      newSelected.delete(featureId);
    } else {
      newSelected.add(featureId);
    }
    const arrNewSelected = Array.from(newSelected);

    setSelected(newSelected);
    if (!areEqualArr(arrNewSelected, selectedFeatureIds)) {
      onChange(arrNewSelected);
    }
    return arrNewSelected;
  };

  return (
    <CollapsibleSection title="Caratteristiche" defaultOpen={false}>
      {isLoading ? (
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
                selected.has(feature.id) ? "border-primary bg-muted/50" : "border-input"
              )}
              onClick={() => handleUserToggle(feature.id)}
            >
              <Checkbox
                checked={selected.has(feature.id)}
                onCheckedChange={() => handleUserToggle(feature.id)}
              />
              <span className="text-sm">{feature.title}</span>
            </div>
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
};

export default FeaturesSelector;
