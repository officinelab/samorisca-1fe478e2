import React from "react";
import { useAllergenCheckboxes } from "@/hooks/allergens/useAllergenCheckboxes";
import CollapsibleSection from "@/components/dashboard/CollapsibleSection";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface AllergenSelectorProps {
  selectedAllergenIds: string[];
  onChange: (allergenIds: string[]) => void;
}

const AllergenSelector: React.FC<AllergenSelectorProps> = ({ selectedAllergenIds, onChange }) => {
  const { allergens, isLoading, toggleAllergen, selected } = useAllergenCheckboxes(selectedAllergenIds);

  const handleAllergenToggle = (allergenId: string) => {
    const newSelection = toggleAllergen(allergenId);
    onChange(newSelection);
  };

  return (
    <CollapsibleSection title="Allergeni" defaultOpen={false}>
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
                selected.has(allergen.id) ? "border-primary bg-muted/50" : "border-input"
              )}
              onClick={() => handleAllergenToggle(allergen.id)}
            >
              <Checkbox 
                checked={selected.has(allergen.id)} 
                onCheckedChange={() => handleAllergenToggle(allergen.id)} 
              />
              <span className="text-sm">
                {allergen.number && `${allergen.number}. `}{allergen.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
};

export default AllergenSelector;

