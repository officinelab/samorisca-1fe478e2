
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";

/**
 * This hook manages selectedAllergens ONLY if the product changes.
 * It will update ONLY when product.id changes, and only if the loaded value is different.
 * Prevents infinite loops when editing.
 */
export const useProductAllergens = (product?: Product) => {
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastProductId = useRef<string | undefined>();

  useEffect(() => {
    // Only trigger when product id actually changes
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
            // Only set state if value REALLY changed (prevents self-loop)
            const hasChanged =
              allergenIds.length !== selectedAllergens.length ||
              !allergenIds.every(id => selectedAllergens.includes(id));
            if (hasChanged) {
              setSelectedAllergens(allergenIds);
            }
          }
        } catch (error) {
          console.error("Errore nel caricamento degli allergeni del prodotto:", error);
        } finally {
          setIsLoading(false);
          lastProductId.current = product.id;
        }
      };
      fetchProductAllergens();
    } else if (!product?.id && lastProductId.current !== undefined) {
      // Only reset if we actually cleared the product, prevent redundant resets
      if (selectedAllergens.length > 0) setSelectedAllergens([]);
      lastProductId.current = undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  return { selectedAllergens, setSelectedAllergens, isLoading };
};
