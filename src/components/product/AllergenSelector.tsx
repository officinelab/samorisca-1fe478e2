
import React, { useRef } from "react";
import { useAllergenCheckboxes } from "@/hooks/allergens/useAllergenCheckboxes";
import CollapsibleSection from "@/components/dashboard/CollapsibleSection";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface AllergenSelectorProps {
  selectedAllergenIds: string[];
  onChange: (allergenIds: string[]) => void;
}

const AllergenSelector: React.FC<AllergenSelectorProps> = ({ selectedAllergenIds, onChange }) => {
  const isProcessingRef = useRef(false);
  const { allergens, isLoading, selected } = useAllergenCheckboxes(selectedAllergenIds);

  const handleAllergenToggle = (allergenId: string) => {
    if (isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    
    // Utilizziamo una funzione pura per calcolare il nuovo stato
    const newSelection = Array.from(selected).slice(); // Crea una copia
    const index = newSelection.indexOf(allergenId);
    
    if (index >= 0) {
      newSelection.splice(index, 1); // Rimuove l'allergene
    } else {
      newSelection.push(allergenId); // Aggiunge l'allergene
    }
    
    // Utilizziamo setTimeout per uscire dall'attuale ciclo di rendering
    setTimeout(() => {
      onChange(newSelection);
      isProcessingRef.current = false;
    }, 0);
  };

  return (
    <CollapsibleSection title="Allergeni" defaultOpen={false}>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Caricamento allergeni...</div>
      ) : allergens.length === 0 ? (
        <div className="text-sm text-muted-foreground">Nessun allergene disponibile</div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {allergens.map((allergen) => {
            const isSelected = selected.includes(allergen.id);
            return (
              <div
                key={allergen.id}
                className={cn(
                  "flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
                  isSelected ? "border-primary bg-muted/50" : "border-input"
                )}
                onClick={() => handleAllergenToggle(allergen.id)}
              >
                <Checkbox 
                  checked={isSelected}
                  id={`allergen-${allergen.id}`}
                  onCheckedChange={() => {}} 
                />
                <span className="text-sm">
                  {allergen.number && `${allergen.number}. `}{allergen.title}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </CollapsibleSection>
  );
};

export default AllergenSelector;
