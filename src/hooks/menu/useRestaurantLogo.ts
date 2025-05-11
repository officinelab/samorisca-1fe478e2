
import { useState } from 'react';
import { getStoredLogo, setStoredLogo } from './menuStorage';

export const useRestaurantLogo = () => {
  const [restaurantLogo, setRestaurantLogo] = useState<string | null>(getStoredLogo());

  // Update restaurant logo
  const updateRestaurantLogo = (logoUrl: string) => {
    setRestaurantLogo(logoUrl);
    setStoredLogo(logoUrl);
  };

  return {
    restaurantLogo,
    updateRestaurantLogo
  };
};
