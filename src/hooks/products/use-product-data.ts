
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductLabel } from "@/types/database";

/**
 * Hook to load product-related data (labels, allergens, features)
 */
export const useProductData = (product?: Product) => {
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Load product labels
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const { data } = await supabase
          .from("product_labels")
          .select("*")
          .order("display_order", { ascending: true });
          
        setLabels(data || []);
      } catch (error) {
        console.error("Errore nel caricamento delle etichette:", error);
      }
    };
    
    fetchLabels();
  }, []);
  
  // Load product allergens
  useEffect(() => {
    if (product?.id) {
      const fetchProductAllergens = async () => {
        try {
          const { data } = await supabase
            .from("product_allergens")
            .select("allergen_id")
            .eq("product_id", product.id);
            
          if (data) {
            const allergenIds = data.map(item => item.allergen_id);
            setSelectedAllergens(allergenIds);
          }
        } catch (error) {
          console.error("Errore nel caricamento degli allergeni del prodotto:", error);
        }
      };
      
      fetchProductAllergens();
    } else {
      // Reset allergens when no product is selected
      setSelectedAllergens([]);
    }
  }, [product?.id]);
  
  // Load product features
  useEffect(() => {
    if (product?.id) {
      const fetchProductFeatures = async () => {
        try {
          const { data } = await supabase
            .from("product_to_features")
            .select("feature_id")
            .eq("product_id", product.id);
            
          if (data) {
            const featureIds = data.map(item => item.feature_id);
            console.log("Caratteristiche caricate dal DB:", featureIds);
            setSelectedFeatures(featureIds);
          }
        } catch (error) {
          console.error("Errore nel caricamento delle caratteristiche del prodotto:", error);
        }
      };
      
      fetchProductFeatures();
    } else {
      // Reset features when no product is selected
      setSelectedFeatures([]);
    }
  }, [product?.id]);

  // Funzione stabile per aggiornare selectedFeatures evitando cicli di aggiornamento
  const setSelectedFeaturesStable = useCallback((features: string[]) => {
    setSelectedFeatures(prevFeatures => {
      // Skip update if arrays are identical
      if (prevFeatures.length === features.length && 
          prevFeatures.every(f => features.includes(f)) &&
          features.every(f => prevFeatures.includes(f))) {
        return prevFeatures;
      }
      return features;
    });
  }, []);
  
  return {
    labels,
    selectedAllergens,
    setSelectedAllergens,
    selectedFeatures,
    setSelectedFeatures: setSelectedFeaturesStable
  };
};
