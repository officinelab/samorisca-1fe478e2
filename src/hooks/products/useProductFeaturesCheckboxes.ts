
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";

export function useProductFeaturesCheckboxes(productId?: string) {
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carica le caratteristiche associate al prodotto
  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      const fetchProductFeatures = async () => {
        try {
          const { data } = await supabase
            .from("product_to_features")
            .select("feature_id")
            .eq("product_id", productId);

          if (data) {
            const featureIds = data.map(item => item.feature_id);
            setSelectedFeatureIds(featureIds);
          }
        } catch (error) {
          console.error("Errore nel caricamento delle caratteristiche del prodotto:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProductFeatures();
    } else {
      setSelectedFeatureIds([]);
    }
  }, [productId]);

  // Example dummy data for available features (replace with actual data/fetch as needed)
  const features = [];

  // Handlers for toggling selection (implement actual feature list and logic as needed)
  function toggleFeature(id: string) {
    setSelectedFeatureIds(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  }

  return {
    features,
    selectedFeatureIds,
    setSelectedFeatureIds,
    toggleFeature,
    loading: isLoading,
  };
}
