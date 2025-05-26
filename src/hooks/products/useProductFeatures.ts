
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";

/**
 * Only reset/reload selectedFeatures when product id changes,
 * and state is actually different, to prevent infinite loops.
 */
export const useProductFeatures = (product?: Product) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastProductId = useRef<string | undefined>();

  useEffect(() => {
    if (product?.id && product.id !== lastProductId.current) {
      setIsLoading(true);
      const fetchProductFeatures = async () => {
        try {
          const { data } = await supabase
            .from("product_to_features")
            .select("feature_id")
            .eq("product_id", product.id);

          if (data) {
            const featureIds = data.map(item => item.feature_id);
            const hasChanged =
              featureIds.length !== selectedFeatures.length ||
              !featureIds.every(id => selectedFeatures.includes(id));
            if (hasChanged) {
              setSelectedFeatures(featureIds);
            }
          }
        } catch (error) {
          console.error("Errore nel caricamento delle caratteristiche del prodotto:", error);
        } finally {
          setIsLoading(false);
          lastProductId.current = product.id;
        }
      };
      fetchProductFeatures();
    } else if (!product?.id && lastProductId.current !== undefined) {
      if (selectedFeatures.length > 0) setSelectedFeatures([]);
      lastProductId.current = undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  return { selectedFeatures, setSelectedFeatures, isLoading };
};
