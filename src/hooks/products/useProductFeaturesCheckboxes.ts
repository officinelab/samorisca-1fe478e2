
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductFeature } from "@/types/database";

export function useProductFeaturesCheckboxes(productId?: string) {
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Carica tutte le features disponibili
  useEffect(() => {
    const fetchFeatures = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("product_features")
        .select("*")
        .order("display_order", { ascending: true });
      if (!error) setFeatures(data || []);
      setLoading(false);
    };
    fetchFeatures();
  }, []);

  // Carica le features selezionate per il prodotto (solo in edit)
  useEffect(() => {
    if (!productId) {
      setSelectedFeatureIds([]);
      return;
    }
    const fetchSelected = async () => {
      const { data, error } = await supabase
        .from("product_to_features")
        .select("feature_id")
        .eq("product_id", productId);
      if (!error && data) {
        setSelectedFeatureIds(data.map((f) => f.feature_id));
      }
    };
    fetchSelected();
  }, [productId]);

  // Funzione per gestire il toggle delle checkbox
  const toggleFeature = (fId: string) => {
    setSelectedFeatureIds((prev) =>
      prev.includes(fId) ? prev.filter((id) => id !== fId) : [...prev, fId]
    );
  };

  // Reset selezioni a mano (opzionale)
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
