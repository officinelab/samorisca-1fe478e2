
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, Allergen } from "@/types/database";

// Funzione di confronto, rimane se serve per future funzioni
function arraysAreDifferent(a: string[], b: string[]) {
  if (a.length !== b.length) return true;
  const sa = [...a].sort();
  const sb = [...b].sort();
  for (let i = 0; i < sa.length; i++) {
    if (sa[i] !== sb[i]) return true;
  }
  return false;
}

/**
 * Hook che carica tutti gli allergeni (SOLO la lista allergeni disponibili),
 * la selezione locale NON viene mai sovrascritta da db.
 * Gli allergeni selezionati partono SEMPRE da array vuoto.
 */
export const useProductAllergens = (_product?: Product) => {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carica tutti gli allergeni solo la prima volta che il componente si monta
  useEffect(() => {
    let mounted = true;
    const fetchAllergens = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("allergens")
        .select("*")
        .order("display_order", { ascending: true });
      if (mounted && !error && data) setAllergens(data);
      setIsLoading(false);
    };
    fetchAllergens();
    return () => { mounted = false; };
  }, []);

  // selectedAllergens ora è SOLO locale, nessun sincronismo con DB
  const safeSetSelectedAllergens = (allergenIds: string[] | ((prev: string[]) => string[])) => {
    setSelectedAllergens(allergenIds);
  };

  return {
    allergens,
    selectedAllergens,
    setSelectedAllergens: safeSetSelectedAllergens,
    isLoading
  };
};

