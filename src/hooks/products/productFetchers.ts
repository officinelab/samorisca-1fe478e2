
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";

/**
 * Recupera tutti i prodotti dal database
 */
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*, label:label_id(*)")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Errore durante il recupero dei prodotti:", error);
    throw error;
  }

  return data || [];
};

/**
 * Recupera un prodotto specifico dal database in base all'ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*, label:label_id(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Errore durante il recupero del prodotto:", error);
    if (error.code === 'PGRST116') {
      // Prodotto non trovato
      return null;
    }
    throw error;
  }

  return data;
};
