
import React from 'react';

export interface AllergenHeaderProps {
  restaurantLogo?: string | null;
}

const AllergenHeader: React.FC<AllergenHeaderProps> = ({ 
  restaurantLogo 
}) => {
  return (
    <div className="allergens-header mb-6">
      <div className="flex items-center justify-between">
        {restaurantLogo && (
          <img 
            src={restaurantLogo} 
            alt="Logo ristorante" 
            className="h-14 object-contain"
          />
        )}
        <h1 className="text-3xl font-bold text-center flex-1">
          Allergeni e Intolleranze
        </h1>
      </div>
      <div className="allergen-intro mt-4 mb-6">
        <p className="text-sm text-gray-600">
          Gentile cliente, di seguito trova la leggenda degli allergeni che potrebbe trovare nei nostri piatti.
          Per qualsiasi informazione sul cibo o sulle bevande servite e sulla presenza di ingredienti o prodotti che provocano 
          allergie o intolleranze, si prega di contattare il nostro personale di sala prima di ordinare.
        </p>
      </div>
    </div>
  );
};

export default AllergenHeader;
