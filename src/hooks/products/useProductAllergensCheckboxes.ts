import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Allergen } from "@/types/database";

export function useProductAllergensCheckboxes(productId?: string) {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Carica tutti gli allergeni disponibili
  useEffect(() => {
    async function fetchAllergens() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("allergens")
        .select("*")
        .order("display_order", { ascending: true });
      if (!error && data) setAllergens(data);
      setIsLoading(false);
    }
    fetchAllergens();
  }, []);

  // Carica allergeni collegati al prodotto
  useEffect(() => {
    if (!productId) {
      setSelected(new Set());
      return;
    }
    async function fetchSelectedAllergens() {
      const { data, error } = await supabase
        .from("product_allergens")
        .select("allergen_id")
        .eq("product_id", productId);
      if (!error && data) setSelected(new Set(data.map(r => r.allergen_id)));
    }
    fetchSelectedAllergens();
  }, [productId]);

  const toggleAllergen = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return { allergens, selected, setSelected, toggleAllergen, isLoading };
}
