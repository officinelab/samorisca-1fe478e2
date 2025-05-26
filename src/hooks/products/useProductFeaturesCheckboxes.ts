
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductFeature } from "@/types/database";

export function useProductFeaturesCheckboxes(productId?: string) {
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Carica tutte le features disponibili
  useEffect(() => {
    async function fetchFeatures() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("product_features")
        .select("*")
        .order("display_order", { ascending: true });
      if (!error && data) setFeatures(data);
      setIsLoading(false);
    }
    fetchFeatures();
  }, []);

  // Carica features collegate al prodotto
  useEffect(() => {
    if (!productId) {
      setSelected(new Set());
      return;
    }
    async function fetchSelectedFeatures() {
      const { data, error } = await supabase
        .from("product_to_features")
        .select("feature_id")
        .eq("product_id", productId);
      if (!error && data) setSelected(new Set(data.map(r => r.feature_id)));
    }
    fetchSelectedFeatures();
  }, [productId]);

  const toggleFeature = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return { features, selected, setSelected, toggleFeature, isLoading };
}
