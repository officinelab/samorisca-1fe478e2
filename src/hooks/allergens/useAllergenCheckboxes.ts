
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
    const currentIds = JSON.stringify([...selectedAllergenIds].sort());
    const selectedIds = JSON.stringify([...selected].sort());
    
    if (currentIds !== selectedIds) {
      console.log("Aggiornamento selezione allergeni:", { da: selected, a: selectedAllergenIds });
      setSelected([...selectedAllergenIds]);
    }
  }, [selectedAllergenIds]);

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
      
      setTimeout(() => {
        onChange(newSelection);
        processingRef.current = false;
      }, 0);
      
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
