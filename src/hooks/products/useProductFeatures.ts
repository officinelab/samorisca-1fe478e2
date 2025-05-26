
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductFeature } from "@/types/database";

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
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastProductId = useRef<string | undefined>();
  const productIdRef = useRef(product?.id);
  productIdRef.current = product?.id;

  // Carica tutte le features all'avvio
  useEffect(() => {
    let mounted = true;
    const fetchFeatures = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("product_features")
        .select("*")
        .order("display_order", { ascending: true });
      if (!error && mounted && data) setFeatures(data);
      setIsLoading(false);
    };
    fetchFeatures();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const currentProductId = productIdRef.current;

    if (!currentProductId) {
      if (lastProductId.current !== undefined) {
        setSelectedFeatures([]);
        lastProductId.current = undefined;
      }
      return;
    }

    if (currentProductId === lastProductId.current) {
      return;
    }

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

  // SAFE setter: evita update inutili comparando array ordinati
  const safeSetSelectedFeatures = (featureIds: string[] | ((prev: string[]) => string[])) => {
    if (typeof featureIds === "function") {
      setSelectedFeatures(featureIds);
    } else {
      setSelectedFeatures(prev => {
        const prevSorted = [...prev].sort().join(',');
        const nextSorted = [...featureIds].sort().join(',');
        if (prevSorted === nextSorted) {
          return prev; // Evita update/react re-render
        }
        return featureIds;
      });
    }
  };

  return {
    features, // array completo di oggetti ProductFeature
    selectedFeatures,
    setSelectedFeatures: safeSetSelectedFeatures,
    isLoading
  };
};
