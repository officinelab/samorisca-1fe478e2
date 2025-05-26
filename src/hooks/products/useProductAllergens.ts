
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

export const useProductAllergens = (product?: Product) => {
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastProductId = useRef<string | undefined>();
  // memo productId, aggiorna sempre a valore attuale
  const productIdRef = useRef(product?.id);
  productIdRef.current = product?.id;

  useEffect(() => {
    const currentProductId = productIdRef.current;

    // Se non c'è product id, resetta lo stato
    if (!currentProductId) {
      if (lastProductId.current !== undefined) {
        setSelectedAllergens([]);
        lastProductId.current = undefined;
      }
      return;
    }

    // Se l'id è lo stesso, non fare nulla
    if (currentProductId === lastProductId.current) {
      return;
    }

    // Fetch allergens per il nuovo prodotto
    setIsLoading(true);
    const fetchProductAllergens = async () => {
      try {
        const { data, error } = await supabase
          .from("product_allergens")
          .select("allergen_id")
          .eq("product_id", currentProductId);

        if (error) throw error;

        if (data) {
          const allergenIds = data.map(item => item.allergen_id);
          setSelectedAllergens(allergenIds);
        }
      } catch (error) {
        console.error("Errore nel caricamento allergeni:", error);
        setSelectedAllergens([]);
      } finally {
        lastProductId.current = currentProductId;
        setIsLoading(false);
      }
    };

    fetchProductAllergens();
  }, [product?.id]);

  // Safe setter: evita setState ridondanti
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
  };
};
