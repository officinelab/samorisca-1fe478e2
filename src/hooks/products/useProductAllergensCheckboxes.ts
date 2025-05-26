
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Allergen } from "@/types/database";

// Utility più robusta per confronto array
function arraysAreEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function useProductAllergensCheckboxes(productId?: string) {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [selectedAllergenIds, setSelectedAllergenIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const prevAllergenIds = useRef<string[]>([]);

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

  useEffect(() => {
    if (!productId) {
      setSelectedAllergenIds([]);
      prevAllergenIds.current = [];
      return;
    }

    let mounted = true;
    const fetchSelected = async () => {
      const { data, error } = await supabase
        .from("product_allergens")
        .select("allergen_id")
        .eq("product_id", productId);

      if (!error && data && mounted) {
        const nextIds = (data || [])
          .map(f => typeof f.allergen_id === "string" ? f.allergen_id : undefined)
          .filter((id): id is string => !!id && id.length > 0);

        // Confronto con il ref; aggiorna solo se realmente cambiato
        if (!arraysAreEqual(prevAllergenIds.current, nextIds)) {
          setSelectedAllergenIds(nextIds);
          prevAllergenIds.current = nextIds; // Solo DOPO setState
        }
      }
    };

    fetchSelected();
    return () => { mounted = false };
    // eslint-disable-next-line
  }, [productId]);

  const toggleAllergen = (aId: string) => {
    setSelectedAllergenIds((prev) => {
      let updated: string[];
      if (prev.includes(aId)) {
        updated = prev.filter((id) => id !== aId);
      } else {
        updated = [...prev, aId];
      }
      // Aggiorna la ref subito dopo aver cambiato stato
      prevAllergenIds.current = updated;
      return updated;
    });
  };

  const resetSelectedAllergens = () => {
    setSelectedAllergenIds([]);
    prevAllergenIds.current = [];
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
