
import { useState, useEffect, useRef, useCallback } from "react";
import { Allergen } from "@/types/database";
import { fetchAllergens } from "./allergensService";

// Hook per gestire la lista di allergeni selezionabili
export const useAllergenCheckboxes = (selectedAllergenIds: string[] = []) => {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedAllergenIds));
  const isUpdatingRef = useRef(false);
  const lastSelectedRef = useRef<Set<string>>(new Set(selectedAllergenIds));
  
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
  
  // Aggiorna la selezione quando cambiano gli allergeni selezionati
  useEffect(() => {
    if (!isUpdatingRef.current) {
      // Verifichiamo se c'è un cambiamento effettivo per evitare cicli di aggiornamento
      const currentSet = new Set(selectedAllergenIds);
      if (areSetsEqual(lastSelectedRef.current, currentSet)) {
        return;
      }
      
      // Aggiorniamo lo stato locale e il riferimento
      lastSelectedRef.current = currentSet;
      setSelected(new Set(selectedAllergenIds));
    }
  }, [selectedAllergenIds]);

  // Helper per confrontare due Set
  const areSetsEqual = (a: Set<string>, b: Set<string>): boolean => {
    if (a.size !== b.size) return false;
    for (const item of a) {
      if (!b.has(item)) return false;
    }
    return true;
  };

  // Toggle per selezionare/deselezionare un allergene in modo sicuro
  const toggleAllergen = useCallback((allergenId: string): string[] => {
    if (isUpdatingRef.current) return Array.from(selected);
    
    isUpdatingRef.current = true;
    
    const newSelected = new Set(selected);
    if (newSelected.has(allergenId)) {
      newSelected.delete(allergenId);
    } else {
      newSelected.add(allergenId);
    }
    
    setSelected(newSelected);
    lastSelectedRef.current = newSelected;
    
    // Rilasciamo il blocco dopo l'aggiornamento
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 0);
    
    return Array.from(newSelected);
  }, [selected]);

  return {
    allergens,
    isLoading,
    selected,
    toggleAllergen,
    selectedAllergens: Array.from(selected)
  };
};
