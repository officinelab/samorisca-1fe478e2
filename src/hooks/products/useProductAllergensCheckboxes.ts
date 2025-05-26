
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Allergen } from "@/types/database";

function arraysAreDifferent(a: string[], b: string[]) {
  if (a.length !== b.length) return true;
  const sa = [...a].sort();
  const sb = [...b].sort();
  for (let i = 0; i < sa.length; i++) {
    if (sa[i] !== sb[i]) return true;
  }
  return false;
}

export function useProductAllergensCheckboxes(productId?: string) {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [selectedAllergenIds, setSelectedAllergenIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Ref per evitare ripetuti setState usless
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
          .map((f) => typeof f.allergen_id === "string" ? f.allergen_id : undefined)
          .filter((id): id is string => !!id && id.length > 0);

        // Solo aggiorna se effettivamente diverso dal precedente
        if (arraysAreDifferent(prevAllergenIds.current, nextIds)) {
          // log per debug:
          console.log("[useProductAllergensCheckboxes] Effettuo update selectedAllergenIds", nextIds);
          setSelectedAllergenIds(nextIds);
          prevAllergenIds.current = nextIds; // salva lo stato attuale per prossimo ciclo
        } else {
          // Se uguale, skippo
          // console.log("[useProductAllergensCheckboxes] Nessun update necessario");
        }
      }
    };
    fetchSelected();
    return () => { mounted = false };
    // eslint-disable-next-line
  }, [productId]);

  const toggleAllergen = (aId: string) => {
    setSelectedAllergenIds((prev) => {
      const updated = prev.includes(aId) ? prev.filter((id) => id !== aId) : [...prev, aId];
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
