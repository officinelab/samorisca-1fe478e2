
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Allergen } from "@/types/database";

interface Props {
  allergens: Allergen[];
  selectedAllergenIds: string[];
  setSelectedAllergenIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  loading: boolean;
}

const ProductAllergensCheckboxes: React.FC<Props> = ({
  allergens,
  selectedAllergenIds,
  setSelectedAllergenIds,
  loading,
}) => {
  if (loading) {
    return <div className="text-sm text-muted-foreground">Caricamento allergeni...</div>;
  }

  if (!Array.isArray(allergens) || allergens.length === 0) {
    return <div className="text-sm text-muted-foreground">Nessun allergene disponibile</div>;
  }

  const handleChange = (allergenId: string, checked: boolean) => {
    setSelectedAllergenIds(prev => {
      if (checked) {
        return prev.includes(allergenId) ? prev : [...prev, allergenId];
      } else {
        return prev.filter(id => id !== allergenId);
      }
    });
  };

  return (
    <div>
      <Label className="block text-xs mb-2">Allergeni</Label>
      <div className="grid grid-cols-2 gap-2">
        {allergens.map((allergen) => {
          const checked = Array.isArray(selectedAllergenIds) && selectedAllergenIds.includes(allergen.id);
          return (
            <label
              key={allergen.id}
              className={cn(
                "flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
                checked ? "border-primary bg-muted/50" : "border-input"
              )}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(checked) => handleChange(allergen.id, checked as boolean)}
              />
              <span className="text-sm">
                {allergen.number && `${allergen.number}. `}
                {allergen.title}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default ProductAllergensCheckboxes;