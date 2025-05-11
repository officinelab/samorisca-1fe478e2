
import { useAllergens } from "./useAllergens";
import { useAllergenSelection } from "./useAllergenSelection";
import { Allergen } from "@/types/database";

// Hook per gestire la lista di allergeni selezionabili
export const useAllergenCheckboxes = (selectedAllergenIds: string[] = []) => {
  // Carica la lista di allergeni
  const { allergens, isLoading } = useAllergens();
  
  // Gestisce lo stato di selezione
  const { selected, toggleAllergen, selectedAllergenIds: currentSelectedIds } = 
    useAllergenSelection(selectedAllergenIds);

  // Ottieni gli allergeni completi (con tutti i dati) dalla selezione IDs
  const getSelectedFullAllergens = () => {
    return allergens.filter(allergen => selected.has(allergen.id));
  };

  return {
    allergens,
    isLoading,
    selected,
    toggleAllergen,
    selectedAllergens: currentSelectedIds,
    selectedFullAllergens: getSelectedFullAllergens()
  };
};
