
import { useState, useEffect, useRef, useCallback } from "react";
import { Allergen } from "@/types/database";
import { fetchAllergens } from "./allergensService";

// Hook ottimizzato per gestire la lista di allergeni selezionabili
export const useAllergenCheckboxes = (selectedAllergenIds: string[] = []) => {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>(selectedAllergenIds);
  const processingRef = useRef(false);
  const prevSelectedRef = useRef<string[]>(selectedAllergenIds);
  
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
    if (processingRef.current) return;
    
    // Convertiamo in Set per un confronto più efficiente
    const currentSet = new Set(selectedAllergenIds);
    const localSet = new Set(selected);
    
    // Se le dimensioni sono diverse, sicuramente sono diversi
    if (currentSet.size !== localSet.size) {
      prevSelectedRef.current = [...selectedAllergenIds];
      setSelected([...selectedAllergenIds]);
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
      prevSelectedRef.current = [...selectedAllergenIds];
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
      
      // Utilizziamo requestAnimationFrame per uscire dal ciclo di rendering corrente
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
