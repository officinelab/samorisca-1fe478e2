
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Allergen } from "@/types/database";

interface ProductDetailsAllergensProps {
  allergens?: Allergen[];
  allergensLabel: string;
}

export const ProductDetailsAllergens: React.FC<ProductDetailsAllergensProps> = ({
  allergens,
  allergensLabel
}) => {
  if (!allergens || allergens.length === 0) return null;

  return (
    <div>
      <h4 className="font-semibold mb-1">{allergensLabel}</h4>
      <div className="flex flex-wrap gap-2">
        {allergens.map(allergen => (
          <Badge key={allergen.id} variant="outline">
            {allergen.number} - {allergen.displayTitle || allergen.title}
          </Badge>
        ))}
      </div>
    </div>
  );
};
