
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductFeature } from "@/types/database";

// Utility più robusta per confronto array
function arraysAreEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function useProductFeaturesCheckboxes(productId?: string) {
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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
          .map(f => typeof f.feature_id === "string" ? f.feature_id : undefined)
          .filter((id): id is string => !!id && id.length > 0);

        // Confronto con il ref; aggiorna solo se realmente cambiato
        if (!arraysAreEqual(prevFeatureIds.current, nextIds)) {
          setSelectedFeatureIds(nextIds);
          prevFeatureIds.current = nextIds; // Solo DOPO setState
        }
      }
    };
    fetchSelected();
    return () => { mounted = false };
    // eslint-disable-next-line
  }, [productId]);

  const toggleFeature = (fId: string) => {
    setSelectedFeatureIds((prev) => {
      let updated: string[];
      if (prev.includes(fId)) {
        updated = prev.filter((id) => id !== fId);
      } else {
        updated = [...prev, fId];
      }
      // Aggiorna la ref subito dopo aver cambiato stato
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
