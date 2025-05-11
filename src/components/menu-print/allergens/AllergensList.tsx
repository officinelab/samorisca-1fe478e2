
import React from 'react';
import { Allergen } from '@/types/database';
import AllergenItem from './AllergenItem';

type AllergensListProps = {
  allergens: Allergen[];
  layoutType: 'classic' | 'modern' | 'allergens' | 'custom';
};

const AllergensList: React.FC<AllergensListProps> = ({ allergens, layoutType }) => {
  const getListStyle = () => {
    switch (layoutType) {
      case 'modern':
        return {
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '16px',
        };
      case 'allergens':
        return {
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '0px',
        };
      case 'custom':
        return {
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '12px',
        };
      case 'classic':
      default:
        return {
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '10px',
        };
    }
  };

  return (
    <div style={getListStyle()} className={layoutType === 'classic' ? 'allergens-grid' : ''}>
      {allergens.map(allergen => (
        <AllergenItem key={allergen.id} allergen={allergen} layoutType={layoutType} />
      ))}
    </div>
  );
};

export default AllergensList;
