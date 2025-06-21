
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Allergen } from '@/types/database';
import AllergenItem from './AllergenItem';

interface AllergensListProps {
  allergens: Allergen[];
  layout: PrintLayout;
  showTitleAndDescription: boolean;
}

const AllergensList: React.FC<AllergensListProps> = ({ 
  allergens, 
  layout, 
  showTitleAndDescription 
}) => {
  if (allergens.length === 0) return null;

  return (
    <div className="allergens-list" style={{ 
      marginTop: showTitleAndDescription ? '10mm' : '0mm' 
    }}>
      {allergens.map((allergen) => (
        <AllergenItem
          key={allergen.id}
          allergen={allergen}
          layout={layout}
        />
      ))}
    </div>
  );
};

export default AllergensList;
