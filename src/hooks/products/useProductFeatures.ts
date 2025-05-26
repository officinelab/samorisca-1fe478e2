
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";

/**
 * Hook aggiornato: aggiorna selectedFeatures solo quando cambia
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

export const useProductFeatures = (product?: Product) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastProductId = useRef<string | undefined>();

  useEffect(() => {
    // Esegui solo se cambia ID prodotto
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
            setSelectedFeatures(prev => {
              if (arraysAreDifferent(featureIds, prev)) {
                return featureIds;
              }
              return prev;
            });
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
      setSelectedFeatures([]);
      lastProductId.current = undefined;
    }
  }, [product?.id]);

  return { selectedFeatures, setSelectedFeatures, isLoading };
};
