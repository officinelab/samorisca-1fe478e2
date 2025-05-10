
import React, { useState, useEffect } from "react";
import { ProductFeature } from "@/types/database";
import CollapsibleSection from "@/components/dashboard/CollapsibleSection";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface FeaturesSelectorProps {
  selectedFeatureIds: string[];
  onChange: (featureIds: string[]) => void;
}

const FeaturesSelector: React.FC<FeaturesSelectorProps> = ({ selectedFeatureIds, onChange }) => {
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedFeatureIds || []));

  // Carica le caratteristiche dei prodotti
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

  // Aggiorna la selezione quando cambiano le caratteristiche selezionate dall'esterno
  useEffect(() => {
    // Ensure selectedFeatureIds is always an array before creating a Set
    setSelected(new Set(selectedFeatureIds || []));
  }, [selectedFeatureIds]);

  // Toggle per selezionare/deselezionare una caratteristica
  const toggleFeature = (featureId: string) => {
    // Crea una nuova copia del Set per non modificare direttamente lo stato
    const newSelected = new Set(selected);
    
    if (newSelected.has(featureId)) {
      newSelected.delete(featureId);
    } else {
      newSelected.add(featureId);
    }
    
    // Prima aggiorniamo lo stato locale
    setSelected(newSelected);
    
    // Notifichiamo il componente genitore con la nuova selezione
    // Use setTimeout to break the rendering cycle and prevent infinite loop
    setTimeout(() => {
      onChange(Array.from(newSelected));
    }, 0);
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
              onClick={() => toggleFeature(feature.id)}
            >
              <Checkbox 
                checked={selected.has(feature.id)} 
                onCheckedChange={() => toggleFeature(feature.id)} 
                id={`feature-${feature.id}`}
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
