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
  // Stato per gli allergeni correnti mostrati (locale)
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastLoadedProductId = useRef<string | undefined>();

  // Caricamento allergeni dal database solo al cambio prodotto
  useEffect(() => {
    const currentProductId = product?.id;

    // Caso: Nessun prodotto selezionato, svuota solo una volta
    if (!currentProductId) {
      if (lastLoadedProductId.current !== undefined) {
        setSelectedAllergens([]);
        lastLoadedProductId.current = undefined;
      }
      return;
    }

    // Caso: Lo stesso prodotto selezionato → NON fare nulla!
    if (currentProductId === lastLoadedProductId.current) {
      return;
    }

    setIsLoading(true);
    const fetchProductAllergens = async () => {
      try {
        const { data, error } = await supabase
          .from("product_allergens")
          .select("allergen_id")
          .eq("product_id", currentProductId);

        if (error) throw error;

        const allergenIds = data ? data.map(item => item.allergen_id) : [];
        setSelectedAllergens(allergenIds); // Aggiorna solo quando cambio prodotto
      } catch (error) {
        console.error("Errore nel caricamento allergeni:", error);
        setSelectedAllergens([]);
      } finally {
        lastLoadedProductId.current = currentProductId;
        setIsLoading(false);
      }
    };

    fetchProductAllergens();
  }, [product?.id]);

  // Setter che aggiorna SOLO se ci sono differenze reali (evita loop)
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
