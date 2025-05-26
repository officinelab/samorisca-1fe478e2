
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, Allergen } from "@/types/database";

// Resta la funzione di confronto
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
 * Hook che carica tutti gli allergeni, e pre-seleziona quelli del prodotto SOLO all'inizio o quando cambia davvero il prodotto.
 * NON fa re-fetch o reset dello stato locale delle selezioni dopo il primo caricamento per evitare loop infiniti/check infinite.
 */
export const useProductAllergens = (product?: Product) => {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Ci serve tenere traccia di quale prodotto abbiamo fatto mount iniziale
  const lastLoadedProductId = useRef<string | undefined>(undefined);

  // Carica tutti gli allergeni (sempre solo la prima volta che il componente si monta)
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

  // Fetch degli allergeni associati al prodotto SOLO 1 volta quando cambia il prodotto!
  useEffect(() => {
    const productId = product?.id;

    // Se non cambia productId, niente fetch!
    if (!productId || productId === lastLoadedProductId.current)
      return;

    let mounted = true;

    const fetchProductAllergens = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("product_allergens")
        .select("allergen_id")
        .eq("product_id", productId);
      if (error) {
        if (mounted) setSelectedAllergens([]);
        setIsLoading(false);
        lastLoadedProductId.current = productId;
        return;
      }
      const allergenIds = data ? data.map(item => item.allergen_id) : [];
      if (mounted) {
        setSelectedAllergens(allergenIds); // Inizializza SOLO la prima volta!
        lastLoadedProductId.current = productId;
      }
      setIsLoading(false);
    };

    fetchProductAllergens();
    // Nessun effetto collaterale quando selectedAllergens cambia!
    return () => { mounted = false; };

    // SOLO se cambia il prodotto si triggera, NON su selectedAllergens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  // Setter "safe": aggiorna solo se l'array è DAVVERO diverso
  const safeSetSelectedAllergens = (allergenIds: string[] | ((prev: string[]) => string[])) => {
    if (typeof allergenIds === "function") {
      setSelectedAllergens(allergenIds);
    } else {
      setSelectedAllergens(prev => {
        const prevSorted = [...prev].sort().join(',');
        const nextSorted = [...allergenIds].sort().join(',');
        if (prevSorted === nextSorted) {
          return prev;
        }
        return allergenIds;
      });
    }
  };

  return {
    allergens,
    selectedAllergens,
    setSelectedAllergens: safeSetSelectedAllergens,
    isLoading
  };
};
