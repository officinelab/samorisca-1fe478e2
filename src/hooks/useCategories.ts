
import { useState, useEffect } from "react";
import { Category } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Carica le categorie all'inizializzazione del componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        
        // Mock data per ora - sostituire con una vera chiamata API quando necessario
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('position', { ascending: true });
          
        if (error) throw error;
        
        setCategories(data || []);
      } catch (err: any) {
        console.error("Errore durante il caricamento delle categorie:", err);
        setError(err.message || "Si è verificato un errore durante il caricamento delle categorie");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  return {
    categories,
    setCategories,
    isLoading,
    error
  };
};

export default useCategories;
