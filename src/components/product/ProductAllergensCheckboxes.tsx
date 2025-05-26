
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Allergen } from "@/types/database";

interface Props {
  productId?: string;
  allergens: Allergen[];
  selectedAllergenIds: string[];
  toggleAllergen: (id: string) => void;
  loading: boolean;
}

const ProductAllergensCheckboxes: React.FC<Props> = ({
  productId,
  allergens,
  selectedAllergenIds,
  toggleAllergen,
  loading,
}) => {
  return (
    <div>
      <Label className="block text-xs mb-2">Allergeni</Label>
      {loading ? (
        <div className="text-sm text-muted-foreground">Caricamento allergeni...</div>
      ) : allergens.length === 0 ? (
        <div className="text-sm text-muted-foreground">Nessun allergene disponibile</div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {allergens.map((allergen) => (
            <div
              key={allergen.id}
              className={cn(
                "flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
                selectedAllergenIds.includes(allergen.id) ? "border-primary bg-muted/50" : "border-input"
              )}
              onClick={() => toggleAllergen(allergen.id)}
            >
              <Checkbox
                checked={selectedAllergenIds.includes(allergen.id)}
                onCheckedChange={() => toggleAllergen(allergen.id)}
              />
              <span className="text-sm">{allergen.number && `${allergen.number}. `}{allergen.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductAllergensCheckboxes;

