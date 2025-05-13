
import React from 'react';
import { Allergen } from '@/types/database';

export interface AllergensListProps {
  allergens: Allergen[];
}

const AllergensList: React.FC<AllergensListProps> = ({ 
  allergens 
}) => {
  return (
    <div className="allergens-list">
      {allergens.map((allergen, index) => (
        <div 
          key={allergen.id} 
          className="allergen-item flex items-center py-2 border-b border-gray-200"
        >
          <div className="allergen-number mr-3 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            {index + 1}
          </div>
          <div className="allergen-details flex-1">
            <div className="allergen-name font-semibold">
              {allergen.name}
            </div>
            <div className="allergen-desc text-sm text-gray-600">
              {allergen.description || "Nessuna descrizione disponibile"}
            </div>
          </div>
          {allergen.icon && (
            <div className="allergen-icon w-8 h-8 ml-2">
              <img 
                src={allergen.icon} 
                alt={allergen.name} 
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllergensList;
