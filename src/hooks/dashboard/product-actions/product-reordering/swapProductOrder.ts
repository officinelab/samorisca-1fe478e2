
import { Product } from "@/types/database";

export const swapProductOrder = (
  products: Product[], 
  currentIndex: number,
  newIndex: number
): Product[] | null => {
  // Verify that both indices are valid
  if (
    currentIndex < 0 || 
    newIndex < 0 || 
    currentIndex >= products.length || 
    newIndex >= products.length
  ) {
    return null;
  }
  
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
  
  return updatedProducts;
};
