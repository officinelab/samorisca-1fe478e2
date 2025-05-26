
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductFeature } from "@/types/database";

export const useProductFeatures = (product?: Product) => {
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Carica features del prodotto
  useEffect(() => {
    if (!product?.id) {
      setSelectedFeatures([]);
      return;
    }

    let mounted = true;
    const fetchProductFeatures = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("product_to_features")
          .select("feature_id")
          .eq("product_id", product.id);

        if (error) throw error;
        if (mounted && data) {
          const featureIds = data.map(item => item.feature_id);
          setSelectedFeatures(featureIds);
        }
      } catch (error) {
        if (mounted) setSelectedFeatures([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProductFeatures();
    return () => { mounted = false; };
  }, [product?.id]);

  return {
    features,
    selectedFeatures,
    setSelectedFeatures,
    isLoading
  };
};
