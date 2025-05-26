
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";

/**
 * Hook aggiornato: aggiorna selectedAllergens solo quando cambia
 * realmente l'id prodotto e solo se cambia effettivamente la selezione.
 */
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

  useEffect(() => {
    // Esegui solo se cambia ID prodotto
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
            // Modifica stato solo se davvero diverso
            setSelectedAllergens(prev => {
              if (arraysAreDifferent(allergenIds, prev)) {
                return allergenIds;
              }
              return prev;
            });
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
      setSelectedAllergens([]);
      lastProductId.current = undefined;
    }
  }, [product?.id]);

  return { selectedAllergens, setSelectedAllergens, isLoading };
};
