
import { useCallback } from "react";
import { Product } from "@/types/database";
import { swapProductOrder } from "./product-reordering/swapProductOrder";
import { updateProductOrder } from "./product-reordering/updateProductOrder";

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
    
    // Get the updated products after swapping
    const updatedProducts = swapProductOrder(products, currentIndex, newIndex);
    
    if (!updatedProducts) return false;
    
    try {
      // Get the products involved
      const product1 = updatedProducts[currentIndex];
      const product2 = updatedProducts[newIndex];
      
      // Update in the database
      const success = await updateProductOrder(product1, product2);
      
      if (success) {
        return updatedProducts;
      } else {
        // Reload products in case of error
        if (categoryId) {
          loadProducts(categoryId);
        }
        return null;
      }
    } catch (error) {
      console.error('Error reordering products:', error);
      // Reload products in case of error
      if (categoryId) {
        loadProducts(categoryId);
      }
      return null;
    }
  }, [products, categoryId, loadProducts]);

  return { reorderProduct };
};
