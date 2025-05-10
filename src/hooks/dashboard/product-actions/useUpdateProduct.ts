
import { useCallback } from "react";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

export const useUpdateProduct = (
  categoryId: string | null, 
  loadProducts: (categoryId: string) => Promise<Product[] | void>,
  selectProduct: (productId: string) => void
) => {
  // Update a product
  const updateProduct = useCallback(async (productId: string, productData: Partial<Product>) => {
    try {
      // Create a copy of the product data without allergens and features
      const { allergens, features, ...productUpdateData } = productData;
      
      // Handle the "none" value for label_id
      if (productUpdateData.label_id === "none") {
        productUpdateData.label_id = null;
      }
      
      // Update the product data in the products table
      const { error } = await supabase
        .from('products')
        .update(productUpdateData)
        .eq('id', productId);
      
      if (error) throw error;
      
      // Handle allergens separately if they are present
      if (allergens !== undefined) {
        // Remove all existing associations
        const { error: deleteError } = await supabase
          .from('product_allergens')
          .delete()
          .eq('product_id', productId);
        
        if (deleteError) throw deleteError;
        
        // Add the new associations if there are any
        if (allergens.length > 0) {
          const allergenInserts = allergens.map(allergen => ({
            product_id: productId,
            allergen_id: allergen.id,
          }));

          const { error: insertError } = await supabase
            .from('product_allergens')
            .insert(allergenInserts);
          
          if (insertError) throw insertError;
        }
      }
      
      // Handle features separately if they are present
      if (features !== undefined) {
        // Remove all existing associations
        const { error: deleteError } = await supabase
          .from('product_to_features')
          .delete()
          .eq('product_id', productId);
        
        if (deleteError) throw deleteError;
        
        // Add the new associations if there are any
        if (features.length > 0) {
          const featureInserts = features.map(feature => ({
            product_id: productId,
            feature_id: feature.id,
          }));

          const { error: insertError } = await supabase
            .from('product_to_features')
            .insert(featureInserts);
          
          if (insertError) throw insertError;
        }
      }
      
      // Update products
      if (categoryId) {
        await loadProducts(categoryId);
      }
      
      // Reselect the updated product
      selectProduct(productId);
      
      toast.success("Product updated successfully!");
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error("Error updating product. Please try again later.");
      return false;
    }
  }, [categoryId, loadProducts, selectProduct]);

  return { updateProduct };
};
