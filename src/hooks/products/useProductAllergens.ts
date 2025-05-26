import { Product } from "@/types/database";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook che mantiene lo stato locale degli allergeni selezionati per un prodotto.
 * Aggiorna il DB solo su salvataggio esplicito.
 */
export const useProductAllergens = (product?: Product) => {
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const lastLoadedProductId = useRef<string | undefined>(undefined);

  useEffect(() => {
    const productId = product?.id;
    if (!productId) {
      if (lastLoadedProductId.current !== undefined) {
        setSelectedAllergens([]);
        lastLoadedProductId.current = undefined;
      }
      return;
    }

    if (lastLoadedProductId.current === productId) return;

    const fetchProductAllergens = async () => {
      const { data, error } = await supabase
        .from("product_allergens")
        .select("allergen_id")
        .eq("product_id", productId);

      if (error) {
        console.error("Errore nel caricamento allergeni prodotto:", error);
        setSelectedAllergens([]);
      } else {
        setSelectedAllergens(data?.map(item => item.allergen_id) || []);
      }
      lastLoadedProductId.current = productId;
    };

    fetchProductAllergens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  return {
    selectedAllergens,
    setSelectedAllergens,
    isLoading: false
  };
};
