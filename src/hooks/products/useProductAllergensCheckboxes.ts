import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Allergen } from "@/types/database";

/**
 * Confronta due array di stringhe e ritorna true se diversi.
 */
function arraysAreDifferent(a: string[], b: string[]) {
  if (a.length !== b.length) return true;
  const sa = [...a].sort();
  const sb = [...b].sort();
  for (let i = 0; i < sa.length; i++) {
    if (sa[i] !== sb[i]) return true;
  }
  return false;
}

// Loads allergens and manages selected allergens for a single product.
// Ensures no endless update loops when editing product.
export function useProductAllergensCheckboxes(productId?: string) {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [selectedAllergenIds, setSelectedAllergenIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all available allergens ONCE
  useEffect(() => {
    let mounted = true;
    const fetchAllergens = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("allergens")
        .select("*")
        .order("display_order", { ascending: true });
      if (!error && mounted) setAllergens(data || []);
      setLoading(false);
    };
    fetchAllergens();
    return () => { mounted = false };
  }, []);

  // Only load selected allergens if productId exists
  useEffect(() => {
    if (!productId) {
      setSelectedAllergenIds([]);
      return;
    }
    let mounted = true;
    const fetchSelected = async () => {
      const { data, error } = await supabase
        .from("product_allergens")
        .select("allergen_id")
        .eq("product_id", productId);
      if (!error && data && mounted) {
        // Solo stringhe realmente valide
        const nextIds = (data || [])
          .map((f) => typeof f.allergen_id === "string" ? f.allergen_id : undefined)
          .filter((id): id is string => !!id && id.length > 0);

        setSelectedAllergenIds((prev) =>
          arraysAreDifferent(prev, nextIds) ? nextIds : prev
        );
      }
    };
    fetchSelected();
    return () => { mounted = false };
    // eslint-disable-next-line
  }, [productId]);

  // Local toggle, does not save to DB until Save is pressed
  const toggleAllergen = (aId: string) => {
    setSelectedAllergenIds((prev) =>
      prev.includes(aId) ? prev.filter((id) => id !== aId) : [...prev, aId]
    );
  };

  // Optionally allow for manual reset
  const resetSelectedAllergens = () => setSelectedAllergenIds([]);

  return {
    allergens,
    selectedAllergenIds,
    setSelectedAllergenIds,
    toggleAllergen,
    resetSelectedAllergens,
    loading,
  };
}
