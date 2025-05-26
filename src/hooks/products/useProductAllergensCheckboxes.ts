
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Allergen } from "@/types/database";

export function useProductAllergensCheckboxes(productId?: string) {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [selectedAllergenIds, setSelectedAllergenIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Carica tutti gli allergeni disponibili
  useEffect(() => {
    const fetchAllergens = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("allergens")
        .select("*")
        .order("display_order", { ascending: true });
      if (!error) setAllergens(data || []);
      setLoading(false);
    };
    fetchAllergens();
  }, []);

  // Carica allergeni collegati al prodotto (solo in edit)
  useEffect(() => {
    if (!productId) {
      setSelectedAllergenIds([]);
      return;
    }
    const fetchSelected = async () => {
      const { data, error } = await supabase
        .from("product_allergens")
        .select("allergen_id")
        .eq("product_id", productId);
      if (!error && data) {
        setSelectedAllergenIds(data.map((f) => f.allergen_id));
      }
    };
    fetchSelected();
  }, [productId]);

  // Funzione per gestire il toggle delle checkbox
  const toggleAllergen = (aId: string) => {
    setSelectedAllergenIds((prev) =>
      prev.includes(aId) ? prev.filter((id) => id !== aId) : [...prev, aId]
    );
  };

  // Reset selezioni a mano (opzionale)
  const resetSelectedAllergens = () => {
    setSelectedAllergenIds([]);
  };

  return {
    allergens,
    selectedAllergenIds,
    setSelectedAllergenIds,
    toggleAllergen,
    resetSelectedAllergens,
    loading,
  };
}
