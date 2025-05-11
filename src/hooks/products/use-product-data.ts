
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductLabel } from "@/types/database";

/**
 * Hook ottimizzato per caricare dati relativi ai prodotti (etichette, allergeni, caratteristiche)
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
    } else {
      // Reset features when no product is selected
      setSelectedFeatures([]);
    }
  }, [product?.id]);

  // Funzione per l'aggiornamento degli allergeni
  const setSelectedAllergensStable = useCallback((allergens: string[]) => {
    if (isUpdatingRef.current) return;
    
    isUpdatingRef.current = true;
    console.log("Aggiornamento allergeni:", allergens);
    
    setTimeout(() => {
      setSelectedAllergens(allergens);
      isUpdatingRef.current = false;
    }, 0);
  }, []);

  // Funzione per l'aggiornamento delle caratteristiche
  const setSelectedFeaturesStable = useCallback((features: string[]) => {
    if (isUpdatingRef.current) return;
    
    isUpdatingRef.current = true;
    console.log("Aggiornamento caratteristiche:", features);
    
    setTimeout(() => {
      setSelectedFeatures(features);
      isUpdatingRef.current = false;
    }, 0);
  }, []);

  return {
    labels,
    selectedAllergens,
    setSelectedAllergens: setSelectedAllergensStable,
    selectedFeatures,
    setSelectedFeatures: setSelectedFeaturesStable
  };
};
