
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";

export function useProductAllergensCheckboxes(productId?: string) {
  const [selectedAllergenIds, setSelectedAllergenIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carica gli allergeni associati al prodotto
  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      const fetchProductAllergens = async () => {
        try {
          const { data } = await supabase
            .from("product_allergens")
            .select("allergen_id")
            .eq("product_id", productId);

          if (data) {
            const allergenIds = data.map(item => item.allergen_id);
            setSelectedAllergenIds(allergenIds);
          }
        } catch (error) {
          console.error("Errore nel caricamento degli allergeni del prodotto:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProductAllergens();
    } else {
      setSelectedAllergenIds([]);
    }
  }, [productId]);

  // Example dummy data for available allergens (replace with actual data/fetch as needed)
  const allergens = [];

  // Handlers for toggling selection (implement actual allergen list and logic as needed)
  function toggleAllergen(id: string) {
    setSelectedAllergenIds(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  }

  return {
    allergens,
    selectedAllergenIds,
    setSelectedAllergenIds,
    toggleAllergen,
    loading: isLoading,
  };
}
