
import { useState } from "react";
import { Allergen } from "@/types/database";

/**
 * Hook che gestisce solo lo stato degli allergeni associati a un prodotto
 * Inizializza dallo stato fornito (product?.allergen_ids) e NON fa fetch.
 */
export const useProductAllergens = (product?: { allergen_ids?: string[] }) => {
  // Lo stato locale degli allergeni selezionati
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(product?.allergen_ids ?? []);

  // La lista di tutti gli allergeni disponibili ora deve arrivare da "a monte"
  // Lascio allergeni come array vuoto per compatibilità
  const allergens: Allergen[] = [];

  return {
    allergens,
    selectedAllergens,
    setSelectedAllergens,
    isLoading: false,
  };
};
