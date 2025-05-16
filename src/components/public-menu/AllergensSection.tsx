
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { Allergen } from "@/types/database";

interface AllergensSectionProps {
  allergens: Allergen[];
  showAllergensInfo: boolean;
  toggleAllergensInfo: () => void;
}

export const AllergensSection: React.FC<AllergensSectionProps> = ({
  allergens,
  showAllergensInfo,
  toggleAllergensInfo
}) => {
  return (
    <section className="pt-6 border-t">
      <Button 
        variant="ghost" 
        className="flex items-center mb-2" 
        onClick={toggleAllergensInfo}
      >
        <Info size={18} className="mr-2" />
        {showAllergensInfo ? "Nascondi informazioni allergeni" : "Mostra informazioni allergeni"}
      </Button>
      
      {showAllergensInfo && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold mb-2">Legenda Allergeni</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {allergens.map(allergen => (
              <div key={allergen.id} className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  {allergen.number}
                </Badge>
                <span className="text-sm">{allergen.displayTitle || allergen.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
