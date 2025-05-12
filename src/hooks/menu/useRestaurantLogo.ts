
import { useState, useEffect } from 'react';
import { getStoredLogo, setStoredLogo } from './menuStorage';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

export const useRestaurantLogo = () => {
  const [restaurantLogo, setRestaurantLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carica il logo all'avvio
  useEffect(() => {
    const loadLogo = async () => {
      try {
        setIsLoading(true);
        
        // Prima prova a caricare da Supabase
        const { data: settings } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'menuLogo')
          .single();
          
        if (settings?.value) {
          console.log("Logo caricato da Supabase:", settings.value);
          setRestaurantLogo(settings.value);
          // Aggiorna anche il localStorage per compatibilità
          await setStoredLogo(settings.value);
          setIsLoading(false);
          return;
        }
        
        // Se non trovato su Supabase, prova il localStorage
        const logo = await getStoredLogo();
        if (logo) {
          console.log("Logo caricato da localStorage:", logo);
          setRestaurantLogo(logo);
          
          // Salva su Supabase per futuri accessi
          await supabase
            .from('site_settings')
            .upsert({ key: 'menuLogo', value: logo });
        }
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
      console.log("Aggiornamento logo a:", logoUrl);
      
      // Salva su Supabase
      await supabase
        .from('site_settings')
        .upsert({ key: 'menuLogo', value: logoUrl });
        
      // Salva anche nel localStorage per compatibilità
      await setStoredLogo(logoUrl);
      
      setRestaurantLogo(logoUrl);
      toast.success("Logo aggiornato con successo");
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
