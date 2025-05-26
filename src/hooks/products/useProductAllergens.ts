
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";

export const useProductAllergens = (product?: Product) => {
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carica gli allergeni solo quando cambia product.id
  useEffect(() => {
    if (product?.id) {
      setIsLoading(true);
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
        } finally {
          setIsLoading(false);
        }
      };

      fetchProductAllergens();
    } else {
      setSelectedAllergens([]);
    }
  }, [product?.id]); // dipendenza: SOLO product.id

  return { selectedAllergens, setSelectedAllergens, isLoading };
};

