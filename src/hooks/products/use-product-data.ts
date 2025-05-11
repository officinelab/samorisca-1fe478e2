
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
    
    const currentSet = new Set(selectedAllergens);
    const newSet = new Set(allergens);
    
    // Confronto rapido basato su dimensione
    if (currentSet.size !== newSet.size) {
      setSelectedAllergens([...allergens]);
    } else {
      // Controllo approfondito se le dimensioni sono uguali
      let isDifferent = false;
      for (const item of newSet) {
        if (!currentSet.has(item)) {
          isDifferent = true;
          break;
        }
      }
      
      if (isDifferent) {
        setSelectedAllergens([...allergens]);
      }
    }
    
    // Utilizziamo requestAnimationFrame invece di setTimeout per garantire sincronizzazione con il rendering
    requestAnimationFrame(() => {
      isUpdatingRef.current = false;
    });
  }, [selectedAllergens]);

  // Funzione sicura per l'aggiornamento delle caratteristiche
  const setSelectedFeaturesStable = useCallback((features: string[]) => {
    if (isUpdatingRef.current) return;
    
    isUpdatingRef.current = true;
    
    const currentSet = new Set(selectedFeatures);
    const newSet = new Set(features);
    
    // Confronto rapido basato su dimensione
    if (currentSet.size !== newSet.size) {
      setSelectedFeatures([...features]);
    } else {
      // Controllo approfondito se le dimensioni sono uguali
      let isDifferent = false;
      for (const item of newSet) {
        if (!currentSet.has(item)) {
          isDifferent = true;
          break;
        }
      }
      
      if (isDifferent) {
        setSelectedFeatures([...features]);
      }
    }
    
    // Utilizziamo requestAnimationFrame invece di setTimeout
    requestAnimationFrame(() => {
      isUpdatingRef.current = false;
    });
  }, [selectedFeatures]);

  return {
    labels,
    selectedAllergens,
    setSelectedAllergens: setSelectedAllergensStable,
    selectedFeatures,
    setSelectedFeatures: setSelectedFeaturesStable
  };
};
