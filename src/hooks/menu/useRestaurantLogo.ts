
import { useState, useEffect } from 'react';
import { getStoredLogo, setStoredLogo } from './menuStorage';
import { toast } from '@/components/ui/sonner';

export const useRestaurantLogo = () => {
  const [restaurantLogo, setRestaurantLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carica il logo all'avvio
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logo = await getStoredLogo();
        setRestaurantLogo(logo);
      } catch (error) {
        console.error("Errore durante il caricamento del logo:", error);
        toast.error("Errore durante il caricamento del logo");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLogo();
  }, []);

  // Update restaurant logo
  const updateRestaurantLogo = async (logoUrl: string) => {
    try {
      await setStoredLogo(logoUrl);
      setRestaurantLogo(logoUrl);
    } catch (error) {
      console.error("Errore durante l'aggiornamento del logo:", error);
      toast.error("Errore durante l'aggiornamento del logo");
    }
  };

  return {
    restaurantLogo,
    updateRestaurantLogo,
    isLoading
  };
};
