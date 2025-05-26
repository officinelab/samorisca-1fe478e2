
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Allergen } from "@/types/database";

interface Props {
  selectedAllergenIds: string[];
  setSelectedAllergenIds: (updater: (prev: string[]) => string[]) => void;
  loading: boolean;
  allergens?: Allergen[]; // opzionale: meglio passarli dal parent se vuoi un flusso completamente controllato
}

const ProductAllergensCheckboxes: React.FC<Props> = ({
  selectedAllergenIds,
  setSelectedAllergenIds,
  loading,
  allergens = [],
}) => {
  // Nessun useEffect, nessun fetch qui! Tutto delegato al parent

  const handleChange = (id: string) => {
    setSelectedAllergenIds(prev =>
      prev.includes(id)
        ? prev.filter(a => a !== id)
        : [...prev, id]
    );
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Caricamento allergeni...</div>;
  }
  if (!Array.isArray(allergens) || allergens.length === 0) {
    return <div className="text-sm text-muted-foreground">Nessun allergene disponibile</div>;
  }

  return (
    <div>
      <Label className="block text-xs mb-2">Allergeni</Label>
      <div className="grid grid-cols-2 gap-2">
        {allergens.map((allergen) => {
          const checked = selectedAllergenIds.includes(allergen.id);
          return (
            <div
              key={allergen.id}
              className={cn(
                "flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
                checked ? "border-primary bg-muted/50" : "border-input"
              )}
              onClick={() => handleChange(allergen.id)}
              tabIndex={0}
              role="button"
              aria-pressed={checked}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => handleChange(allergen.id)}
              />
              <span className="text-sm">
                {allergen.number && `${allergen.number}. `}
                {allergen.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductAllergensCheckboxes;
