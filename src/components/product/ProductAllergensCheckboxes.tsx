
import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Allergen } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

// Funzione per confronto robusto tra array di ID, come negli hook
function arraysAreDifferent(a: string[], b: string[]) {
  if (a.length !== b.length) return true;
  const sa = [...a].sort();
  const sb = [...b].sort();
  for (let i = 0; i < sa.length; i++) {
    if (sa[i] !== sb[i]) return true;
  }
  return false;
}

interface Props {
  productId?: string;
  selectedAllergenIds: string[];
  setSelectedAllergenIds: (ids: string[]) => void;
  loading: boolean;
}

const ProductAllergensCheckboxes: React.FC<Props> = ({
  productId,
  selectedAllergenIds,
  setSelectedAllergenIds,
  loading,
}) => {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchAllergens = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("allergens")
        .select("*")
        .order("display_order", { ascending: true });
      if (!error && mounted) setAllergens(data || []);
      setIsLoading(false);
    };
    fetchAllergens();
    return () => { mounted = false };
  }, []);

  const handleChange = (allergenId: string) => {
    let newAllergenIds: string[];
    if (selectedAllergenIds.includes(allergenId)) {
      newAllergenIds = selectedAllergenIds.filter(id => id !== allergenId);
    } else {
      newAllergenIds = [...selectedAllergenIds, allergenId];
    }
    // Aggiorna solo se effettivamente cambia qualcosa
    if (arraysAreDifferent(selectedAllergenIds, newAllergenIds)) {
      setSelectedAllergenIds(newAllergenIds);
    }
  };

  if (isLoading || loading) {
    return <div className="text-sm text-muted-foreground">Caricamento allergeni...</div>;
  }
  if (allergens.length === 0) {
    return <div className="text-sm text-muted-foreground">Nessun allergene disponibile</div>;
  }

  return (
    <div>
      <Label className="block text-xs mb-2">Allergeni</Label>
      <div className="grid grid-cols-2 gap-2">
        {allergens.map((allergen) => (
          <div
            key={allergen.id}
            className={cn(
              "flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
              selectedAllergenIds.includes(allergen.id)
                ? "border-primary bg-muted/50"
                : "border-input"
            )}
            onClick={() => handleChange(allergen.id)}
          >
            <Checkbox
              checked={selectedAllergenIds.includes(allergen.id)}
              onCheckedChange={() => handleChange(allergen.id)}
            />
            <span className="text-sm">
              {allergen.number && `${allergen.number}. `}
              {allergen.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductAllergensCheckboxes;
