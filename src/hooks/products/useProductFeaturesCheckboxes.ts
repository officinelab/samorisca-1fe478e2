
import { useState, useEffect, useRef } from "react";
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

  // Ref per ricordare il precedente ed evitare loop di setState
  const prevFeatureIds = useRef<string[]>([]);

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

  useEffect(() => {
    if (!productId) {
      setSelectedFeatureIds([]);
      prevFeatureIds.current = [];
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

        if (arraysAreDifferent(prevFeatureIds.current, nextIds)) {
          console.log("[useProductFeaturesCheckboxes] Effettuo update selectedFeatureIds", nextIds);
          setSelectedFeatureIds(nextIds);
          prevFeatureIds.current = nextIds;
        } else {
          // console.log("[useProductFeaturesCheckboxes] Nessun update necessario");
        }
      }
    };
    fetchSelected();
    return () => { mounted = false };
    // eslint-disable-next-line
  }, [productId]);

  const toggleFeature = (fId: string) => {
    setSelectedFeatureIds((prev) => {
      const updated = prev.includes(fId) ? prev.filter((id) => id !== fId) : [...prev, fId];
      prevFeatureIds.current = updated;
      return updated;
    });
  };

  const resetSelectedFeatures = () => {
    setSelectedFeatureIds([]);
    prevFeatureIds.current = [];
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
