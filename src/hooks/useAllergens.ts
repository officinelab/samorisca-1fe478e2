
import { useState, useEffect } from "react";
import { Allergen } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

export const useAllergens = () => {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Carica gli allergeni all'inizializzazione del componente
  useEffect(() => {
    const fetchAllergens = async () => {
      try {
        setIsLoading(true);
        
        // Carica gli allergeni da Supabase
        const { data, error } = await supabase
          .from('allergens')
          .select('*')
          .order('position', { ascending: true });
          
        if (error) throw error;
        
        setAllergens(data || []);
      } catch (err: any) {
        console.error("Errore durante il caricamento degli allergeni:", err);
        setError(err.message || "Si è verificato un errore durante il caricamento degli allergeni");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllergens();
  }, []);
  
  return {
    allergens,
    setAllergens,
    isLoading,
    error
  };
};

export default useAllergens;
