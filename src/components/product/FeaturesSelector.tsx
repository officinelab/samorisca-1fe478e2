
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
  const [isUpdating, setIsUpdating] = useState(false);

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
  // ma solo se non siamo in fase di aggiornamento da un'azione dell'utente
  useEffect(() => {
    if (!isUpdating) {
      setSelected(new Set(selectedFeatureIds || []));
    }
  }, [selectedFeatureIds, isUpdating]);

  // Toggle per selezionare/deselezionare una caratteristica
  const toggleFeature = (featureId: string) => {
    // Segnaliamo che stiamo aggiornando, per evitare che l'useEffect si attivi
    setIsUpdating(true);
    
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
    const newSelection = Array.from(newSelected);
    
    // Utilizziamo setTimeout per spezzare il ciclo di rendering
    setTimeout(() => {
      onChange(newSelection);
      // Resettiamo l'indicatore di aggiornamento
      setIsUpdating(false);
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
