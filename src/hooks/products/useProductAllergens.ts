
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";

/**
 * Hook aggiornato per gestire selectedAllergens senza ciclo infinito.
 * Aggiorna lo stato solo quando product.id cambia realmente.
 */
export const useProductAllergens = (product?: Product) => {
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastProductId = useRef<string | undefined>();

  useEffect(() => {
    if (product?.id && product.id !== lastProductId.current) {
      setIsLoading(true);
      const fetchProductAllergens = async () => {
        try {
          const { data } = await supabase
            .from("product_allergens")
            .select("allergen_id")
            .eq("product_id", product.id);
          if (data) {
            const allergenIds = data.map(item => item.allergen_id);
            setSelectedAllergens(allergenIds);
          }
        } catch (error) {
          console.error("Errore nel caricamento allergeni:", error);
        } finally {
          lastProductId.current = product.id;
          setIsLoading(false);
        }
      };
      fetchProductAllergens();
    } else if (!product?.id && lastProductId.current !== undefined) {
      if (selectedAllergens.length > 0) setSelectedAllergens([]);
      lastProductId.current = undefined;
    }
  }, [product?.id]);

  return { selectedAllergens, setSelectedAllergens, isLoading };
};
