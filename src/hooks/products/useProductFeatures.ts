
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";

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
  const productIdRef = useRef(product?.id);
  productIdRef.current = product?.id;

  useEffect(() => {
    const currentProductId = productIdRef.current;

    // Se non c'è product id, resetta lo stato
    if (!currentProductId) {
      if (lastProductId.current !== undefined) {
        setSelectedFeatures([]);
        lastProductId.current = undefined;
      }
      return;
    }

    // Se l'id è lo stesso, non fare nulla
    if (currentProductId === lastProductId.current) {
      return;
    }

    // Fetch features per il nuovo prodotto
    setIsLoading(true);
    const fetchProductFeatures = async () => {
      try {
        const { data, error } = await supabase
          .from("product_to_features")
          .select("feature_id")
          .eq("product_id", currentProductId);

        if (error) throw error;

        if (data) {
          const featureIds = data.map(item => item.feature_id);
          setSelectedFeatures(featureIds);
        }
      } catch (error) {
        console.error("Errore nel caricamento caratteristiche:", error);
        setSelectedFeatures([]);
      } finally {
        lastProductId.current = currentProductId;
        setIsLoading(false);
      }
    };

    fetchProductFeatures();
  }, [product?.id]);

  const safeSetSelectedFeatures = (featureIds: string[] | ((prev: string[]) => string[])) => {
    if (typeof featureIds === "function") {
      setSelectedFeatures(featureIds);
    } else {
      setSelectedFeatures(prev => {
        if (arraysAreDifferent(featureIds, prev)) {
          return featureIds;
        }
        return prev;
      });
    }
  };

  return {
    selectedFeatures,
    setSelectedFeatures: safeSetSelectedFeatures,
    isLoading
  };
};
