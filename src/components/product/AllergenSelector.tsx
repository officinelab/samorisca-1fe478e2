
import React from "react";
import { useAllergenCheckboxes } from "@/hooks/allergens/useAllergenCheckboxes";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface AllergenSelectorProps {
  selectedAllergenIds: string[];
  onToggleAllergen: (allergenId: string) => void;
}

const AllergenSelector: React.FC<AllergenSelectorProps> = ({
  selectedAllergenIds,
  onToggleAllergen
}) => {
  const { allergens, isLoading } = useAllergenCheckboxes();

  return (
    <div>
      <h3 className="font-semibold text-base mb-2">Allergeni</h3>
      {isLoading ? (
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
                selectedAllergenIds.includes(allergen.id)
                  ? "border-primary bg-muted/50"
                  : "border-input"
              )}
              onClick={() => onToggleAllergen(allergen.id)}
            >
              <Checkbox
                checked={selectedAllergenIds.includes(allergen.id)}
                onCheckedChange={() => onToggleAllergen(allergen.id)}
              />
              <span className="text-sm">
                {allergen.number && `${allergen.number}. `}
                {allergen.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllergenSelector;

