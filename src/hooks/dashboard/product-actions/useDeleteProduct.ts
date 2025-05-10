
import { useCallback } from "react";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

export const useDeleteProduct = (
  categoryId: string | null, 
  loadProducts: (categoryId: string) => Promise<Product[] | void>
) => {
  // Delete a product
  const deleteProduct = useCallback(async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      // Update the local state
      if (categoryId) {
        await loadProducts(categoryId);
      }
      
      toast.success("Product deleted successfully!");
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Error deleting product. Please try again later.");
      return false;
    }
  }, [categoryId, loadProducts]);

  return { deleteProduct };
};
