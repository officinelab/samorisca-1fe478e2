
import React, { useState, useEffect, useRef } from "react";
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
  
  // Usando useRef per evitare re-render quando stiamo solo confrontando array
  const selectedRef = useRef<string[]>(selectedFeatureIds || []);
  
  // Stato locale della selezione che verrà sincronizzato con selectedFeatureIds
  const [selected, setSelected] = useState<string[]>(selectedFeatureIds || []);
  
  // Flag per prevenire aggiornamenti ciclici
  const isUpdatingRef = useRef(false);

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

  // Aggiorna la selezione locale quando cambiano le prop esterne
  useEffect(() => {
    // Evita aggiornamenti in ciclo
    if (isUpdatingRef.current) {
      return;
    }

    // Controlla se gli array sono effettivamente diversi per evitare cicli
    const areDifferent = selectedFeatureIds.length !== selectedRef.current.length ||
      selectedFeatureIds.some(id => !selectedRef.current.includes(id));
      
    if (areDifferent) {
      console.log("Aggiornamento selezione da prop:", selectedFeatureIds);
      selectedRef.current = [...selectedFeatureIds];
      setSelected([...selectedFeatureIds]);
    }
  }, [selectedFeatureIds]);

  // Funzione per gestire il cambiamento di selezione
  const handleToggleFeature = (featureId: string) => {
    // Imposta il flag per prevenire aggiornamenti ciclici
    isUpdatingRef.current = true;
    
    // Calcola la nuova selezione
    let newSelected;
    if (selected.includes(featureId)) {
      newSelected = selected.filter(id => id !== featureId);
    } else {
      newSelected = [...selected, featureId];
    }
    
    // Aggiorna lo stato locale
    setSelected(newSelected);
    selectedRef.current = newSelected;
    
    // Notifica il componente padre
    console.log("Notifica cambiamento:", newSelected);
    onChange(newSelected);
    
    // Resetta il flag dopo un periodo per consentire che il rendering sia completato
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 50);
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
                // Rimuoviamo l'evento onChange dal checkbox per evitare doppi eventi
                // L'evento è già gestito dal click sul div contenitore
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
