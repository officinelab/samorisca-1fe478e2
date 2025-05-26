
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";

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
 * Questo hook mantiene lo stato locale degli allergeni selezionati per un prodotto.
 * Aggiorna il DB solo su salvataggio esplicito (non ad ogni modifica di selezione/check).
 * Effettua il fetch SOLO se il prodotto ha un id valido. 
 */
export const useProductAllergens = (product?: Product) => {
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastLoadedProductId = useRef<string | undefined>(undefined);

  // Effettua fetch solo SE il prodotto ha un id valido, e solo al cambio del productId
  useEffect(() => {
    const productId = product?.id;
    // Skip per prodotti nuovi (senza id), nessun fetch o set automatici
    if (!productId) {
      if (lastLoadedProductId.current !== undefined) {
        setSelectedAllergens([]); // Svuota lo stato, ma solo 1 volta
        lastLoadedProductId.current = undefined;
      }
      return;
    }

    // Se è lo stesso prodotto, non rifare fetch
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
        // Aggiorna solo se c'è reale differenza (no ciclo)
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
  }, [product?.id]); // Dipendi SOLO dal productId vero!

  /**
   * Setter sicuro che aggiorna solo su cambiamento reale (evita loop).
   */
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
    selectedAllergens,
    setSelectedAllergens: safeSetSelectedAllergens,
    isLoading
    // Il salvataggio su DB va fatto solo quando “confermi”/“salvi” il prodotto!
  };
};
