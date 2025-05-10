
import { useCallback } from "react";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

export const useProductReordering = (
  products: Product[], 
  loadProducts: (categoryId: string) => Promise<Product[] | void>, 
  categoryId: string | null
) => {
  // Reorder a product
  const reorderProduct = useCallback(async (productId: string, direction: 'up' | 'down') => {
    // Find the index of the current product
    const currentIndex = products.findIndex(p => p.id === productId);
    if (currentIndex === -1) return false;

    // Calculate the new index
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Verify that the new index is valid
    if (newIndex < 0 || newIndex >= products.length) return false;
    
    // Create a copy of the products array
    const updatedProducts = [...products];
    
    // Get the products involved
    const product1 = updatedProducts[currentIndex];
    const product2 = updatedProducts[newIndex];
    
    // Swap the display orders
    const tempOrder = product1.display_order;
    product1.display_order = product2.display_order;
    product2.display_order = tempOrder;
    
    // Update the local array
    [updatedProducts[currentIndex], updatedProducts[newIndex]] = 
      [updatedProducts[newIndex], updatedProducts[currentIndex]];
    
    try {
      // Update the database with all required fields
      const updates = [
        { 
          id: product1.id, 
          display_order: product1.display_order,
          title: product1.title,
          category_id: product1.category_id,
          description: product1.description,
          image_url: product1.image_url,
          is_active: product1.is_active,
          price_standard: product1.price_standard,
          has_multiple_prices: product1.has_multiple_prices,
          price_variant_1_name: product1.price_variant_1_name,
          price_variant_1_value: product1.price_variant_1_value,
          price_variant_2_name: product1.price_variant_2_name,
          price_variant_2_value: product1.price_variant_2_value,
          has_price_suffix: product1.has_price_suffix,
          price_suffix: product1.price_suffix
        },
        { 
          id: product2.id, 
          display_order: product2.display_order,
          title: product2.title,
          category_id: product2.category_id,
          description: product2.description,
          image_url: product2.image_url,
          is_active: product2.is_active,
          price_standard: product2.price_standard,
          has_multiple_prices: product2.has_multiple_prices,
          price_variant_1_name: product2.price_variant_1_name,
          price_variant_1_value: product2.price_variant_1_value,
          price_variant_2_name: product2.price_variant_2_name,
          price_variant_2_value: product2.price_variant_2_value,
          has_price_suffix: product2.has_price_suffix,
          price_suffix: product2.price_suffix
        }
      ];
      
      const { error } = await supabase
        .from('products')
        .upsert(updates);
      
      if (error) throw error;
      return updatedProducts;
    } catch (error) {
      console.error('Error reordering products:', error);
      toast.error("Error reordering products. Please try again later.");
      // Reload products in case of error
      if (categoryId) {
        loadProducts(categoryId);
      }
      return null;
    }
  }, [products, categoryId, loadProducts]);

  return { reorderProduct };
};
