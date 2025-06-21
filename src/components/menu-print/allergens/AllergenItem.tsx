
import React from 'react';
import { Allergen } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';

interface AllergenItemProps {
  allergen: Allergen;
  layout: PrintLayout;
  spacing?: number; // Nuovo prop per controllare lo spazio del singolo elemento
}

const AllergenItem: React.FC<AllergenItemProps> = ({ 
  allergen, 
  layout,
  spacing = 2 // Default 2mm se non specificato
}) => {
  const allergenConfig = layout.allergens?.allergen;
  
  const itemStyle = {
    marginBottom: `${spacing}mm`, // Usa il valore di spacing
    fontSize: `${allergenConfig?.fontSize || 14}px`,
    color: allergenConfig?.fontColor || '#000000',
    fontFamily: allergenConfig?.fontFamily || 'Arial, sans-serif',
    fontWeight: allergenConfig?.fontStyle === 'bold' ? 'bold' : 'normal',
    fontStyle: allergenConfig?.fontStyle === 'italic' ? 'italic' : 'normal'
  };

  const iconStyle = {
    width: `${(allergenConfig?.iconSize || 16)}px`,
    height: `${(allergenConfig?.iconSize || 16)}px`,
    marginRight: `${(allergenConfig?.iconSpacing || 8)}px`
  };

  return (
    <div className="allergen-item flex items-start w-full" style={itemStyle}>
      {allergen.icon_url && (
        <img
          src={allergen.icon_url}
          alt={`${allergen.name} icon`}
          style={iconStyle}
          className="flex-shrink-0"
        />
      )}
      <span className="flex-1 break-words">
        {allergen.name}
      </span>
    </div>
  );
};

export default AllergenItem;
