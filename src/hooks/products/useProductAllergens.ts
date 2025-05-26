
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";

export const useProductAllergens = (product?: Product) => {
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastProductId = useRef<string | undefined>();

  useEffect(() => {
    console.log("[useProductAllergens] effect running. Current product.id:", product?.id, "Last product.id:", lastProductId.current);
    // Only run when product.id changes, skip if not changed
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
          console.error("Errore nel caricamento degli allergeni del prodotto:", error);
        } finally {
          setIsLoading(false);
          lastProductId.current = product.id;
        }
      };
      fetchProductAllergens();
    } else if (!product?.id) {
      setSelectedAllergens([]);
      lastProductId.current = undefined;
    }
  }, [product?.id]);

  return { selectedAllergens, setSelectedAllergens, isLoading };
};
