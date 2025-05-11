
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ProductFeature } from "@/types/database";
import CollapsibleSection from "@/components/dashboard/CollapsibleSection";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface FeaturesSelectorProps {
  selectedFeatureIds: string[];
  onChange: (featureIds: string[]) => void;
}

const FeaturesSelector: React.FC<FeaturesSelectorProps> = ({ 
  selectedFeatureIds, 
  onChange 
}) => {
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([...selectedFeatureIds]);
  const processingRef = useRef(false);

  // Load product features
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

  // Update local state when props change
  useEffect(() => {
    const currentIds = JSON.stringify([...selectedFeatureIds].sort());
    const selectedIds = JSON.stringify([...selected].sort());
    
    if (currentIds !== selectedIds) {
      console.log("Aggiornamento selezione caratteristiche:", { da: selected, a: selectedFeatureIds });
      setSelected([...selectedFeatureIds]);
    }
  }, [selectedFeatureIds]);

  // Handle feature toggle with optimized update pattern
  const toggleFeature = useCallback((featureId: string) => {
    if (processingRef.current) return;
    processingRef.current = true;
    
    setSelected(current => {
      const newSelection = [...current];
      const index = newSelection.indexOf(featureId);
      
      if (index >= 0) {
        newSelection.splice(index, 1);
      } else {
        newSelection.push(featureId);
      }
      
      console.log("Toggle caratteristica:", { featureId, risultato: newSelection });
      
      setTimeout(() => {
        onChange(newSelection);
        processingRef.current = false;
      }, 0);
      
      return newSelection;
    });
  }, [onChange]);

  return (
    <CollapsibleSection title="Caratteristiche" defaultOpen={false}>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Caricamento caratteristiche...</div>
      ) : features.length === 0 ? (
        <div className="text-sm text-muted-foreground">Nessuna caratteristica disponibile</div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {features.map((feature) => {
            const isSelected = selected.includes(feature.id);
            return (
              <div
                key={feature.id}
                className={cn(
                  "flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
                  isSelected ? "border-primary bg-muted/50" : "border-input"
                )}
                onClick={() => toggleFeature(feature.id)}
              >
                <Checkbox 
                  checked={isSelected}
                  id={`feature-${feature.id}`}
                  onCheckedChange={() => {}}
                />
                <label 
                  htmlFor={`feature-${feature.id}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {feature.title}
                </label>
              </div>
            );
          })}
        </div>
      )}
    </CollapsibleSection>
  );
};

export default FeaturesSelector;
