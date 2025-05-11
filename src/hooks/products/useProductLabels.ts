
import { useState, useEffect } from "react";
import { ProductLabel } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

export const useProductLabels = () => {
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const { data } = await supabase
          .from("product_labels")
          .select("*")
          .order("display_order", { ascending: true });
          
        setLabels(data || []);
      } catch (error) {
        console.error("Errore nel caricamento delle etichette:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLabels();
  }, []);

  return { labels, isLoading };
};
