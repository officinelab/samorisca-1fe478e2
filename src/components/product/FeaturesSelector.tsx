
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
  const [selected, setSelected] = useState<string[]>([]);
  const processingRef = useRef(false);
  const prevSelectedRef = useRef<string[]>([]);

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

  // Update local state when props change, using Sets for efficient comparison
  useEffect(() => {
    if (processingRef.current) return;
    
    const currentSet = new Set(selectedFeatureIds);
    const localSet = new Set(selected);
    
    // Se le dimensioni sono diverse, sicuramente sono diversi
    if (currentSet.size !== localSet.size) {
      prevSelectedRef.current = [...selectedFeatureIds];
      setSelected([...selectedFeatureIds]);
      return;
    }
    
    // Verifichiamo se tutti gli elementi di currentSet sono in localSet
    let isDifferent = false;
    for (const item of currentSet) {
      if (!localSet.has(item)) {
        isDifferent = true;
        break;
      }
    }
    
    if (isDifferent) {
      prevSelectedRef.current = [...selectedFeatureIds];
      setSelected([...selectedFeatureIds]);
    }
  }, [selectedFeatureIds, selected]);

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
      
      // Utilizziamo requestAnimationFrame per uscire dal ciclo di rendering corrente
      requestAnimationFrame(() => {
        onChange(newSelection);
        processingRef.current = false;
      });
      
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
