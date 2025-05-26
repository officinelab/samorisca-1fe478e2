
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Allergen } from "@/types/database";

// Utility robusta per confronto array
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

  // Evita loop continuo di reset
  const lastProductId = useRef<string | undefined>(undefined);

  // Carica tutti gli allergeni all’avvio una sola volta
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

  // Carica allergeni selezionati solo quando productId cambia
  useEffect(() => {
    // Reset solo quando productId passa da un valore a null/undefined
    if (!productId) {
      if (lastProductId.current) {
        setSelectedAllergenIds([]);
        lastProductId.current = undefined;
      }
      return;
    }

    // Evita refetch se productId identico
    if (lastProductId.current === productId) {
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

        if (!arraysAreEqual(selectedAllergenIds, nextIds)) {
          setSelectedAllergenIds(nextIds);
        }
        lastProductId.current = productId;
      }
    };

    fetchSelected();
    return () => { mounted = false };
    // eslint-disable-next-line
  }, [productId]);

  const toggleAllergen = (aId: string) => {
    setSelectedAllergenIds((prev) => {
      if (prev.includes(aId)) {
        return prev.filter((id) => id !== aId);
      } else {
        return [...prev, aId];
      }
    });
  };

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

