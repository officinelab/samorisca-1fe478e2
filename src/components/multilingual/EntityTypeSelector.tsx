
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EntityOption {
  value: string;
  label: string;
  type: 'categories' | 'allergens' | 'product_features' | 'product_labels' | 'category_notes';
}

const entityOptions: EntityOption[] = [
  { value: 'categories', label: 'Categorie', type: 'categories' },
  { value: 'allergens', label: 'Allergeni', type: 'allergens' },
  { value: 'product_features', label: 'Caratteristiche', type: 'product_features' },
  { value: 'product_labels', label: 'Etichette', type: 'product_labels' },
  { value: 'category_notes', label: 'Note Categorie', type: 'category_notes' },
];

interface EntityTypeSelectorProps {
  selectedEntityType: EntityOption;
  onEntityTypeChange: (entityType: EntityOption) => void;
}

export const EntityTypeSelector: React.FC<EntityTypeSelectorProps> = ({
  selectedEntityType,
  onEntityTypeChange,
}) => {
  const handleEntityTypeChange = (value: string) => {
    const selectedOption = entityOptions.find(option => option.value === value);
    if (selectedOption) {
      onEntityTypeChange(selectedOption);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tipo di contenuto</h3>
      <Select
        value={selectedEntityType.value}
        onValueChange={handleEntityTypeChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleziona tipo" />
        </SelectTrigger>
        <SelectContent>
          {entityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export { entityOptions };
export type { EntityOption };
