
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";

export const useProductFeatures = (product?: Product) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Carica le caratteristiche associate al prodotto
  useEffect(() => {
    if (product?.id) {
      setIsLoading(true);
      const fetchProductFeatures = async () => {
        try {
          const { data } = await supabase
            .from("product_to_features")
            .select("feature_id")
            .eq("product_id", product.id);
            
          if (data) {
            const featureIds = data.map(item => item.feature_id);
            setSelectedFeatures(featureIds);
          }
        } catch (error) {
          console.error("Errore nel caricamento delle caratteristiche del prodotto:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchProductFeatures();
    }
  }, [product?.id]);

  return { selectedFeatures, setSelectedFeatures, isLoading };
};

