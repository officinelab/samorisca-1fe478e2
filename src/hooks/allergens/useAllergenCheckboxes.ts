
import { useState, useEffect } from "react";
import { Allergen } from "@/types/database";
import { fetchAllergens } from "./allergensService";

// Hook per gestire la lista di allergeni selezionabili
export const useAllergenCheckboxes = (selectedAllergenIds: string[] = []) => {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedAllergenIds));
  
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
    setSelected(new Set(selectedAllergenIds));
  }, [selectedAllergenIds]);

  // Toggle per selezionare/deselezionare un allergene
  const toggleAllergen = (allergenId: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(allergenId)) {
      newSelected.delete(allergenId);
    } else {
      newSelected.add(allergenId);
    }
    setSelected(newSelected);
    return Array.from(newSelected);
  };

  return {
    allergens,
    isLoading,
    selected,
    toggleAllergen,
    selectedAllergens: Array.from(selected)
  };
};
