
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, Allergen } from "@/types/database";

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
 * Questo hook mantiene lo stato locale degli allergeni selezionati e carica anche TUTTI gli allergeni dal db.
 */
export const useProductAllergens = (product?: Product) => {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastLoadedProductId = useRef<string | undefined>(undefined);

  // Carica tutti gli allergeni all'avvio
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

  // Effettua fetch degli allergeni selezionati solo SE il prodotto ha un id valido, e solo al cambio del productId
  useEffect(() => {
    const productId = product?.id;
    if (!productId) {
      if (lastLoadedProductId.current !== undefined) {
        setSelectedAllergens([]);
        lastLoadedProductId.current = undefined;
      }
      return;
    }
    if (lastLoadedProductId.current === productId) {
      return;
    }

    setIsLoading(true);

    const fetchProductAllergens = async () => {
      try {
        const { data, error } = await supabase
          .from("product_allergens")
          .select("allergen_id")
          .eq("product_id", productId);

        if (error) throw error;
        const allergenIds = data ? data.map(item => item.allergen_id) : [];
        if (arraysAreDifferent(selectedAllergens, allergenIds)) {
          setSelectedAllergens(allergenIds);
        }
      } catch (error) {
        console.error("Errore nel caricamento allergeni:", error);
        setSelectedAllergens([]);
      } finally {
        lastLoadedProductId.current = productId;
        setIsLoading(false);
      }
    };

    fetchProductAllergens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const safeSetSelectedAllergens = (allergenIds: string[] | ((prev: string[]) => string[])) => {
    if (typeof allergenIds === "function") {
      setSelectedAllergens(allergenIds);
    } else {
      setSelectedAllergens(prev => {
        if (arraysAreDifferent(allergenIds, prev)) {
          return allergenIds;
        }
        return prev;
      });
    }
  };

  return {
    allergens, // array completo di oggetti Allergen
    selectedAllergens,
    setSelectedAllergens: safeSetSelectedAllergens,
    isLoading
  };
};
