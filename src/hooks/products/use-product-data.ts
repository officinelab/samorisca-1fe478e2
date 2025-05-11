
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductLabel } from "@/types/database";

/**
 * Hook ottimizzato per caricare dati relativi ai prodotti (etichette, allergeni, caratteristiche)
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
        setLabels([]);
      }
    };
    
    fetchLabels();
  }, []);
  
  // Load product allergens
  useEffect(() => {
    const fetchProductAllergens = async () => {
      if (!product?.id) {
        setSelectedAllergens([]);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("product_allergens")
          .select("allergen_id")
          .eq("product_id", product.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const allergenIds = data.map(item => item.allergen_id);
          console.log("Allergeni caricati per il prodotto:", allergenIds);
          setSelectedAllergens(allergenIds);
        } else {
          setSelectedAllergens([]);
        }
      } catch (error) {
        console.error("Errore nel caricamento degli allergeni del prodotto:", error);
        setSelectedAllergens([]);
      }
    };
    
    fetchProductAllergens();
  }, [product?.id]);
  
  // Load product features
  useEffect(() => {
    const fetchProductFeatures = async () => {
      if (!product?.id) {
        setSelectedFeatures([]);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("product_to_features")
          .select("feature_id")
          .eq("product_id", product.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const featureIds = data.map(item => item.feature_id);
          console.log("Caratteristiche caricate per il prodotto:", featureIds);
          setSelectedFeatures(featureIds);
        } else {
          setSelectedFeatures([]);
        }
      } catch (error) {
        console.error("Errore nel caricamento delle caratteristiche del prodotto:", error);
        setSelectedFeatures([]);
      }
    };
    
    fetchProductFeatures();
  }, [product?.id]);

  // Handlers for updating selections with proper state management
  const setSelectedAllergensHandler = useCallback((allergens: string[]) => {
    console.log("Aggiornamento allergeni chiamato con:", allergens);
    setSelectedAllergens(allergens);
  }, []);

  const setSelectedFeaturesHandler = useCallback((features: string[]) => {
    console.log("Aggiornamento caratteristiche chiamato con:", features);
    setSelectedFeatures(features);
  }, []);

  return {
    labels,
    selectedAllergens,
    setSelectedAllergens: setSelectedAllergensHandler,
    selectedFeatures,
    setSelectedFeatures: setSelectedFeaturesHandler
  };
};
