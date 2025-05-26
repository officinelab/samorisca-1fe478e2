
import { useAllergens } from "./useAllergens";
import { useAllergenSelection } from "./useAllergenSelection";
import { useMemo } from "react";

export const useAllergenCheckboxes = (selectedAllergenIds: string[] = []) => {
  // Memoizza l'array di IDs per evitare re-render inutili
  const memoizedSelectedIds = useMemo(() => selectedAllergenIds, [
    selectedAllergenIds.join(",")
  ]);

  // Carica la lista di allergeni
  const { allergens, isLoading } = useAllergens();

  // Gestisce lo stato di selezione
  const {
    selected,
    toggleAllergen,
    selectedAllergenIds: currentSelectedIds
  } = useAllergenSelection(memoizedSelectedIds);

  // Gli allergeni selezionati in formato completo
  const selectedFullAllergens = useMemo(() => {
    return allergens.filter(allergen => selected.has(allergen.id));
  }, [allergens, selected]);

  return {
    allergens,
    isLoading,
    selected,
    toggleAllergen,
    selectedAllergens: currentSelectedIds,
    selectedFullAllergens
  };
};
