
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductFeature } from "@/types/database";

function arraysAreDifferent(a: string[], b: string[]) {
  if (a.length !== b.length) return true;
  const sa = [...a].sort();
  const sb = [...b].sort();
  for (let i = 0; i < sa.length; i++) {
    if (sa[i] !== sb[i]) return true;
  }
  return false;
}

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
      setSelectedFeatureIds([]);
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
          .map((f) => typeof f.feature_id === "string" ? f.feature_id : undefined)
          .filter((id): id is string => !!id && id.length > 0);

        // Solo se davvero diverso (anche per tipo/riferimento)
        setSelectedFeatureIds((prev) => {
          if (
            arraysAreDifferent(prev, nextIds) &&
            JSON.stringify(prev) !== JSON.stringify(nextIds)
          ) {
            // Extra log di sicurezza
            console.log(
              "[useProductFeaturesCheckboxes] Update features: ",
              "prev:", prev,
              "next:", nextIds
            );
            return nextIds;
          }
          // Nessun update inutile
          return prev;
        });
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
