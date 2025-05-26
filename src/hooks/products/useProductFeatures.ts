
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";

/**
 * Hook aggiornato per gestire selectedFeatures senza ciclo infinito.
 * Aggiorna lo stato solo quando product.id cambia realmente.
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
            setSelectedFeatures(featureIds);
          }
        } catch (error) {
          console.error("Errore nel caricamento caratteristiche:", error);
        } finally {
          lastProductId.current = product.id;
          setIsLoading(false);
        }
      };
      fetchProductFeatures();
    } else if (!product?.id && lastProductId.current !== undefined) {
      if (selectedFeatures.length > 0) setSelectedFeatures([]);
      lastProductId.current = undefined;
    }
  }, [product?.id]);

  return { selectedFeatures, setSelectedFeatures, isLoading };
};
