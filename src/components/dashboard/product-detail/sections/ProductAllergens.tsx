
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Allergen } from "@/types/database";

interface ProductAllergensProps {
  allergens: Allergen[];
}

const ProductAllergens: React.FC<ProductAllergensProps> = ({ allergens }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Allergeni</h3>
        
        <div className="flex flex-wrap gap-2">
          {allergens.map((allergen) => (
            <div 
              key={allergen.id}
              className="bg-gray-100 rounded-full px-3 py-1"
            >
              {allergen.number}: {allergen.title}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductAllergens;
