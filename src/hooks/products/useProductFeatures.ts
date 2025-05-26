
import { useState, useEffect, useRef, useCallback } from "react";
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
  
  // ✅ TRACKING per evitare re-fetch inutili
  const lastProductId = useRef<string | undefined>();
  const isInitialized = useRef(false);

  // ✅ FETCH FEATURES: Solo una volta al mount
  useEffect(() => {
    if (isInitialized.current) return;
    
    let mounted = true;
    const fetchFeatures = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("product_features")
          .select("*")
          .order("display_order", { ascending: true });
        
        if (mounted && !error && data) {
          setFeatures(data);
          isInitialized.current = true;
        }
      } catch (error) {
        console.error("Errore caricamento features:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    
    fetchFeatures();
    return () => { mounted = false; };
  }, []); // ✅ NESSUNA DIPENDENZA = solo al mount

  // ✅ FETCH SELEZIONI: Solo quando cambia product.id
  useEffect(() => {
    const currentProductId = product?.id;

    // ✅ SKIP se non cambia product
    if (currentProductId === lastProductId.current) return;

    // ✅ RESET se non c'è product
    if (!currentProductId) {
      if (lastProductId.current !== undefined) {
        setSelectedFeatures([]);
        lastProductId.current = undefined;
      }
      return;
    }

    let mounted = true;
    setIsLoading(true);
    
    const fetchProductFeatures = async () => {
      try {
        const { data, error } = await supabase
          .from("product_to_features")
          .select("feature_id")
          .eq("product_id", currentProductId);

        if (mounted && !error) {
          const featureIds = data ? data.map(item => item.feature_id) : [];
          setSelectedFeatures(featureIds);
          lastProductId.current = currentProductId;
        }
      } catch (error) {
        console.error("Errore nel caricamento caratteristiche:", error);
        if (mounted) setSelectedFeatures([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProductFeatures();
    return () => { mounted = false; };
  }, [product?.id]); // ✅ SOLO product?.id nelle dipendenze

  // ✅ SETTER STABILIZZATO con useCallback
  const safeSetSelectedFeatures = useCallback((
    featureIds: string[] | ((prev: string[]) => string[])
  ) => {
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
  }, []);

  return {
    features, // ✅ array completo di oggetti ProductFeature
    selectedFeatures,
    setSelectedFeatures: safeSetSelectedFeatures,
    isLoading
  };
};