
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, Allergen } from "@/types/database";

export const useProductAllergens = (product?: Product) => {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carica tutti gli allergeni
  useEffect(() => {
    let mounted = true;
    const fetchAllergens = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("allergens")
        .select("*")
        .order("display_order", { ascending: true });
      if (mounted && !error && data) setAllergens(data);
      setIsLoading(false);
    };
    fetchAllergens();
    return () => { mounted = false; };
  }, []);

  // Carica allergeni del prodotto
  useEffect(() => {
    if (!product?.id) {
      setSelectedAllergens([]);
      return;
    }

    let mounted = true;
    const fetchProductAllergens = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("product_allergens")
          .select("allergen_id")
          .eq("product_id", product.id);

        if (error) throw error;
        if (mounted && data) {
          const allergenIds = data.map(item => item.allergen_id);
          setSelectedAllergens(allergenIds);
        }
      } catch (error) {
        if (mounted) setSelectedAllergens([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProductAllergens();
    return () => { mounted = false; };
  }, [product?.id]);

  return {
    allergens,
    selectedAllergens,
    setSelectedAllergens,
    isLoading
  };
};
