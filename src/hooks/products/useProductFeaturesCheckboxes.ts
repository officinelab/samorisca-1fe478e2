
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductFeature } from "@/types/database";

// Utility robusta per confronto insiemi (non importa l'ordine)
function arraysAreSetEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  for (const el of b) {
    if (!setA.has(el)) return false;
  }
  return true;
}

export function useProductFeaturesCheckboxes(productId?: string) {
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Carica caratteristiche disponibili una volta sola
  useEffect(() => {
    let mounted = true;
    const fetchFeatures = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("product_features")
        .select("*")
        .order("display_order", { ascending: true });
      if (!error && mounted) setFeatures(data || []);
      setLoading(false);
    };
    fetchFeatures();
    return () => { mounted = false };
  }, []);

  // Carica caratteristiche già selezionate dal prodotto (quando productId cambia)
  useEffect(() => {
    if (!productId) {
      if (selectedFeatureIds.length > 0) setSelectedFeatureIds([]);
      return;
    }

    let mounted = true;
    const fetchSelected = async () => {
      const { data, error } = await supabase
        .from("product_to_features")
        .select("feature_id")
        .eq("product_id", productId);

      if (!error && data && mounted) {
        const nextIds = (data || [])
          .map(f => typeof f.feature_id === "string" ? f.feature_id : undefined)
          .filter((id): id is string => !!id && id.length > 0);

        // Confronta come insiemi, non per ordine
        if (!arraysAreSetEqual(selectedFeatureIds, nextIds)) {
          setSelectedFeatureIds(nextIds);
        }
      }
    };
    fetchSelected();
    return () => { mounted = false };
    // eslint-disable-next-line
  }, [productId]);

  const toggleFeature = (fId: string) => {
    setSelectedFeatureIds((prev) => {
      if (prev.includes(fId)) {
        return prev.filter((id) => id !== fId);
      } else {
        return [...prev, fId];
      }
    });
  };

  const resetSelectedFeatures = () => {
    setSelectedFeatureIds([]);
  };

  return {
    features,
    selectedFeatureIds,
    setSelectedFeatureIds,
    toggleFeature,
    resetSelectedFeatures,
    loading,
  };
}
