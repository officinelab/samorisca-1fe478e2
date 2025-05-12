
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

export const useRestaurantLogo = () => {
  const [restaurantLogo, setRestaurantLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load logo from Supabase at startup
  useEffect(() => {
    const loadLogo = async () => {
      try {
        setIsLoading(true);
        
        // Try to load from Supabase site_settings table
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'restaurant_logo')
          .maybeSingle();
        
        if (error) {
          console.error("Error loading logo from Supabase:", error);
          throw error;
        }
        
        if (data) {
          // Converti il valore in stringa se necessario
          const logoUrl = typeof data.value === 'string' ? data.value : String(data.value);
          setRestaurantLogo(logoUrl);
        } else {
          // Fallback to localStorage for backward compatibility
          const localLogo = localStorage.getItem('restaurant_logo');
          if (localLogo) {
            setRestaurantLogo(localLogo);
            // Migrate to Supabase
            await updateRestaurantLogo(localLogo);
          }
        }
      } catch (error) {
        console.error("Errore durante il caricamento del logo:", error);
        
        // Final fallback to localStorage
        try {
          const localLogo = localStorage.getItem('restaurant_logo');
          if (localLogo) {
            setRestaurantLogo(localLogo);
          }
        } catch (localError) {
          console.error("Error loading from localStorage:", localError);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLogo();
  }, []);

  // Update restaurant logo in Supabase
  const updateRestaurantLogo = async (logoUrl: string) => {
    try {
      // Check if record exists
      const { data: existingRecord } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'restaurant_logo')
        .maybeSingle();
      
      // Insert or update based on existence
      if (existingRecord) {
        await supabase
          .from('site_settings')
          .update({
            value: logoUrl,
            updated_at: new Date().toISOString()
          })
          .eq('key', 'restaurant_logo');
      } else {
        await supabase
          .from('site_settings')
          .insert([
            {
              key: 'restaurant_logo',
              value: logoUrl
            }
          ]);
      }
      
      // Also update localStorage as fallback
      localStorage.setItem('restaurant_logo', logoUrl);
      
      // Update state
      setRestaurantLogo(logoUrl);
      return true;
    } catch (error) {
      console.error("Errore durante l'aggiornamento del logo:", error);
      toast.error("Errore durante l'aggiornamento del logo");
      return false;
    }
  };

  return {
    restaurantLogo,
    updateRestaurantLogo,
    isLoading
  };
};
