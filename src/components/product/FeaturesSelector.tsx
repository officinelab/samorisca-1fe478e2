
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

const FeaturesSelector: React.FC<FeaturesSelectorProps> = ({ 
  selectedFeatureIds, 
  onChange 
}) => {
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Sincronizza la selezione con i prop esterni, ma solo quando non siamo in fase di elaborazione
  useEffect(() => {
    if (!isProcessing && JSON.stringify(selectedFeatureIds) !== JSON.stringify(selected)) {
      setSelected([...selectedFeatureIds]);
    }
  }, [selectedFeatureIds, isProcessing]);

  // Funzione per gestire il cambiamento di selezione in modo sicuro
  const handleToggleFeature = (featureId: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    // Calcola la nuova selezione
    const newSelected = selected.includes(featureId)
      ? selected.filter(id => id !== featureId)
      : [...selected, featureId];
    
    // Aggiorna lo stato locale
    setSelected(newSelected);
    
    // Notifica il componente padre con un timeout per evitare cicli di aggiornamento
    setTimeout(() => {
      onChange(newSelected);
      setIsProcessing(false);
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
                selected.includes(feature.id) ? "border-primary bg-muted/50" : "border-input"
              )}
              onClick={() => handleToggleFeature(feature.id)}
            >
              <Checkbox 
                checked={selected.includes(feature.id)}
                id={`feature-${feature.id}`}
                readOnly
              />
              <label 
                htmlFor={`feature-${feature.id}`}
                className="text-sm cursor-pointer flex-1"
              >
                {feature.title}
              </label>
            </div>
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
};

export default FeaturesSelector;
