
import React from 'react';
import { Allergen } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import AllergenItem from './AllergenItem';

interface AllergensListProps {
  allergens: Allergen[];
  layout: PrintLayout;
  spacing?: number; // Nuovo prop per controllare lo spazio tra elementi
}

const AllergensList: React.FC<AllergensListProps> = ({ 
  allergens, 
  layout,
  spacing = 2 // Default 2mm se non specificato
}) => {
  const listStyle = {
    gap: `${spacing}mm` // Usa il valore di spacing passato come prop
  };

  return (
    <div className="allergens-list flex flex-col" style={listStyle}>
      {allergens.map((allergen, index) => (
        <AllergenItem
          key={allergen.id}
          allergen={allergen}
          layout={layout}
          spacing={spacing} // Passa spacing anche al singolo item
        />
      ))}
    </div>
  );
};

export default AllergensList;
