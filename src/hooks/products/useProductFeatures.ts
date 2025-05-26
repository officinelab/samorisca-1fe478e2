
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";

export const useProductFeatures = (product?: Product) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastProductId = useRef<string | undefined>();

  useEffect(() => {
    console.log("[useProductFeatures] effect running. Current product.id:", product?.id, "Last product.id:", lastProductId.current);
    // Only run when product.id changes, skip if not changed
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
          console.error("Errore nel caricamento delle caratteristiche del prodotto:", error);
        } finally {
          setIsLoading(false);
          lastProductId.current = product.id;
        }
      };
      fetchProductFeatures();
    } else if (!product?.id) {
      setSelectedFeatures([]);
      lastProductId.current = undefined;
    }
  }, [product?.id]);

  return { selectedFeatures, setSelectedFeatures, isLoading };
};
