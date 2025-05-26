import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductFeature } from "@/types/database";

/**
 * Confronta due array di stringhe e ritorna true se diversi.
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

// Loads features and manages selected features for a single product.
// Ensures no endless update loops when editing product.
export function useProductFeaturesCheckboxes(productId?: string) {
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all available features ONCE
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

  // Only load selected features if productId exists
  useEffect(() => {
    if (!productId) {
      setSelectedFeatureIds([]); // for new product, none selected
      return;
    }
    let mounted = true;
    const fetchSelected = async () => {
      const { data, error } = await supabase
        .from("product_to_features")
        .select("feature_id")
        .eq("product_id", productId);
      if (!error && data && mounted) {
        // Filtro e conversione rigorosa
        const nextIds = (data || [])
          .map((f) => typeof f.feature_id === "string" ? f.feature_id : undefined)
          .filter((id): id is string => !!id && id.length > 0);

        // Aggiorna stato solo se effettivamente diverso
        setSelectedFeatureIds((prev) =>
          arraysAreDifferent(prev, nextIds) ? nextIds : prev
        );
      }
    };
    fetchSelected();
    return () => { mounted = false };
    // eslint-disable-next-line
  }, [productId]);

  // Local toggle, does not save to DB until Save is pressed
  const toggleFeature = (fId: string) => {
    setSelectedFeatureIds((prev) =>
      prev.includes(fId) ? prev.filter((id) => id !== fId) : [...prev, fId]
    );
  };

  // Optionally allow for manual reset
  const resetSelectedFeatures = () => setSelectedFeatureIds([]);

  return {
    features,
    selectedFeatureIds,
    setSelectedFeatureIds,
    toggleFeature,
    resetSelectedFeatures,
    loading,
  };
}
