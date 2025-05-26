import { Product } from "@/types/database";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook che mantiene lo stato locale delle features selezionate per un prodotto.
 * Aggiorna il DB solo su salvataggio esplicito.
 */
export const useProductFeatures = (product?: Product) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const lastProductId = useRef<string | undefined>();

  useEffect(() => {
    const productId = product?.id;
    if (!productId) {
      if (lastProductId.current !== undefined) {
        setSelectedFeatures([]);
        lastProductId.current = undefined;
      }
      return;
    }

    if (productId === lastProductId.current) return;

    const fetchProductFeatures = async () => {
      const { data, error } = await supabase
        .from("product_to_features")
        .select("feature_id")
        .eq("product_id", productId);

      if (error) {
        console.error("Errore nel caricamento caratteristiche prodotto:", error);
        setSelectedFeatures([]);
      } else {
        setSelectedFeatures(data?.map(item => item.feature_id) || []);
      }
      lastProductId.current = productId;
    };

    fetchProductFeatures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  return {
    selectedFeatures,
    setSelectedFeatures,
    isLoading: false
  };
};
