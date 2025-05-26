
import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Allergen } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  productId?: string;
  selectedAllergenIds: string[];
  setSelectedAllergenIds: (ids: string[] | ((prev: string[]) => string[])) => void;
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

  // Nuova versione robusta
  const handleChange = (allergenId: string) => {
    setSelectedAllergenIds(prev =>
      prev.includes(allergenId)
        ? prev.filter(id => id !== allergenId)
        : [...prev, allergenId]
    );
  };

  if (isLoading || loading) {
    return <div className="text-sm text-muted-foreground">Caricamento allergeni...</div>;
  }
  if (!Array.isArray(allergens) || allergens.length === 0) {
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

