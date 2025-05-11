
import { useState, useEffect, useRef, useCallback } from "react";
import { Allergen } from "@/types/database";
import { fetchAllergens } from "./allergensService";

// Hook ottimizzato per gestire la lista di allergeni selezionabili
export const useAllergenCheckboxes = (selectedAllergenIds: string[] = []) => {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([...selectedAllergenIds]);
  const processingRef = useRef(false);
  
  // Carica la lista di allergeni
  useEffect(() => {
    const loadAllergens = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllergens();
        setAllergens(data);
      } catch (error) {
        console.error("Errore nel caricamento degli allergeni:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllergens();
  }, []);
  
  // Aggiorna la selezione quando cambiano gli allergeni selezionati dall'esterno
  useEffect(() => {
    // Confronto degli array usando Set per evitare problemi di ordinamento
    const currentSet = new Set(selectedAllergenIds);
    const selectedSet = new Set(selected);
    
    // Verifica se i due set sono diversi
    if (currentSet.size !== selectedSet.size || 
        ![...currentSet].every(id => selectedSet.has(id))) {
      console.log("Aggiornamento selezione allergeni:", { da: selected, a: selectedAllergenIds });
      setSelected([...selectedAllergenIds]);
    }
  }, [selectedAllergenIds, selected]);

  // Funzione ottimizzata per gestire il toggle degli allergeni
  const toggleAllergen = useCallback((allergenId: string, onChange: (selection: string[]) => void) => {
    if (processingRef.current) return;
    processingRef.current = true;
    
    setSelected(current => {
      const newSelection = [...current];
      const index = newSelection.indexOf(allergenId);
      
      if (index >= 0) {
        newSelection.splice(index, 1);
      } else {
        newSelection.push(allergenId);
      }
      
      console.log("Toggle allergene:", { allergenId, risultato: newSelection });
      
      // Uso di requestAnimationFrame per garantire che gli aggiornamenti dello stato avvengano nel contesto giusto
      requestAnimationFrame(() => {
        onChange(newSelection);
        processingRef.current = false;
      });
      
      return newSelection;
    });
  }, []);

  return {
    allergens,
    isLoading,
    selected,
    toggleAllergen
  };
};
