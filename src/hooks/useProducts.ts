
import { useState, useEffect } from "react";
import { Product } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

export const useProducts = () => {
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Carica i prodotti all'inizializzazione del componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        // Carica i prodotti da Supabase
        const { data, error } = await supabase
          .from('products')
          .select('*, allergens(*)')
          .order('position', { ascending: true });
          
        if (error) throw error;
        
        // Organizza i prodotti per categoria
        const productsByCategory: Record<string, Product[]> = {};
        
        (data || []).forEach((product: Product) => {
          if (product.category_id) {
            if (!productsByCategory[product.category_id]) {
              productsByCategory[product.category_id] = [];
            }
            productsByCategory[product.category_id].push(product);
          }
        });
        
        setProducts(productsByCategory);
      } catch (err: any) {
        console.error("Errore durante il caricamento dei prodotti:", err);
        setError(err.message || "Si è verificato un errore durante il caricamento dei prodotti");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  return {
    products,
    setProducts,
    isLoading,
    error
  };
};

export default useProducts;
