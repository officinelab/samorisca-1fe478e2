
import React from 'react';
import { Allergen } from '@/types/database';

interface AllergensListProps {
  allergens: Allergen[];
  layoutType: 'classic' | 'modern' | 'custom' | 'allergens';
}

const AllergensList: React.FC<AllergensListProps> = ({ allergens, layoutType }) => {
  if (!allergens || allergens.length === 0) {
    return null;
  }
  
  return (
    <div className="allergens-list">
      <div className="allergens-title">
        Elenco degli allergeni presenti nei piatti:
      </div>
      
      <div className="allergens-grid">
        {allergens.map((allergen) => (
          <div key={allergen.id} className="allergen-item">
            <div className="allergen-number">
              {allergen.number}
            </div>
            <div className="allergen-title">
              {allergen.title || `Allergene ${allergen.number}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllergensList;
