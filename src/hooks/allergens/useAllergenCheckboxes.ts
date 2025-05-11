
import { useState, useEffect } from "react";
import { Allergen } from "@/types/database";
import { fetchAllergens } from "./allergensService";

// Hook semplificato per gestire la lista di allergeni selezionabili
export const useAllergenCheckboxes = (selectedAllergenIds: string[] = []) => {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>(selectedAllergenIds);
  
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
    // Creiamo un controllo basato su stringhe per evitare loop causati 
    // da confronti di referenze di array diversi ma con lo stesso contenuto
    const currentSelectedStr = JSON.stringify([...selectedAllergenIds].sort());
    const localSelectedStr = JSON.stringify([...selected].sort());
    
    if (currentSelectedStr !== localSelectedStr) {
      setSelected(selectedAllergenIds);
    }
  }, [selectedAllergenIds]);

  return {
    allergens,
    isLoading,
    selected
  };
};
