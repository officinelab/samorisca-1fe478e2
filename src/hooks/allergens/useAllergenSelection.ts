
import { useState, useEffect } from "react";

export const useAllergenSelection = (initialSelectedIds: string[] = []) => {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelectedIds));

  // Update selection when initial selected IDs change
  useEffect(() => {
    setSelected(new Set(initialSelectedIds));
  }, [initialSelectedIds]);

  // Toggle selection state for an allergen
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
    selected,
    toggleAllergen,
    selectedAllergenIds: Array.from(selected)
  };
};
