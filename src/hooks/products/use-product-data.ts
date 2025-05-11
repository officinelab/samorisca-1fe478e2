
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductLabel } from "@/types/database";

/**
 * Hook to load product-related data (labels, allergens, features)
 */
export const useProductData = (product?: Product) => {
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const isUpdatingRef = useRef(false);
  
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

  // Funzione sicura per l'aggiornamento degli allergeni
  const setSelectedAllergensStable = useCallback((allergens: string[]) => {
    if (isUpdatingRef.current) return;
    
    isUpdatingRef.current = true;
    
    // Confrontiamo le selezioni come stringhe per evitare problemi di referenza
    const currentStr = JSON.stringify([...selectedAllergens].sort());
    const newStr = JSON.stringify([...allergens].sort());
    
    if (currentStr !== newStr) {
      setSelectedAllergens(allergens);
      console.log("Allergeni aggiornati:", allergens);
    }
    
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 0);
  }, [selectedAllergens]);

  // Funzione sicura per l'aggiornamento delle caratteristiche
  const setSelectedFeaturesStable = useCallback((features: string[]) => {
    if (isUpdatingRef.current) return;
    
    isUpdatingRef.current = true;
    
    // Confrontiamo le selezioni come stringhe per evitare problemi di referenza
    const currentStr = JSON.stringify([...selectedFeatures].sort());
    const newStr = JSON.stringify([...features].sort());
    
    if (currentStr !== newStr) {
      setSelectedFeatures(features);
      console.log("Caratteristiche aggiornate:", features);
    }
    
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 0);
  }, [selectedFeatures]);

  return {
    labels,
    selectedAllergens,
    setSelectedAllergens: setSelectedAllergensStable,
    selectedFeatures,
    setSelectedFeatures: setSelectedFeaturesStable
  };
};
