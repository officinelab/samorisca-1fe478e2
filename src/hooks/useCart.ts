
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/types/database";
import { usePublicMenuUiStrings } from "@/hooks/public-menu/usePublicMenuUiStrings";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  translatedName?: string;
  price: number;
  variantName?: string;
  quantity: number;
}

export const useCart = (language: string = "it") => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { t } = usePublicMenuUiStrings(language);
  
  // Adds a product to the cart
  const addToCart = (product: Product, variantName?: string, variantPrice?: number) => {
    const price = variantPrice !== undefined ? variantPrice : product.price_standard;
    const itemId = `${product.id}${variantName ? `-${variantName}` : ''}`;

    // Check if item is already in cart
    const existingItemIndex = cart.findIndex(item => item.id === itemId);
    if (existingItemIndex >= 0) {
      // Update quantity if already exists
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add new item
      setCart([...cart, {
        id: itemId,
        productId: product.id,
        name: product.title, // Sempre il titolo italiano per il cameriere
        translatedName: product.displayTitle || product.title, // Titolo tradotto per l'utente
        price: price || 0,
        variantName,
        quantity: 1
      }]);
    }
    toast.success(`${product.title} ${t("item_added_to_cart")}`);
  };

  // Removes a product from the cart
  const removeFromCart = (itemId: string) => {
    const existingItemIndex = cart.findIndex(item => item.id === itemId);
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      if (updatedCart[existingItemIndex].quantity > 1) {
        // Decrease quantity
        updatedCart[existingItemIndex].quantity -= 1;
        setCart(updatedCart);
      } else {
        // Remove item
        updatedCart.splice(existingItemIndex, 1);
        setCart(updatedCart);
      }
    }
  };

  // Completely removes a product from the cart
  const removeItemCompletely = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  // Calculates cart total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Clears the cart
  const clearCart = () => {
    setCart([]);
    toast.success(t("order_cancelled"));
  };

  // Submits the order
  const submitOrder = () => {
    // In a real implementation, we might save the order to a database here
    toast.success(t("order_ready_show_waiter"));
    setIsCartOpen(false);
  };

  // Get total number of items in cart
  const getCartItemsCount = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };
  
  return {
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    removeItemCompletely,
    calculateTotal,
    clearCart,
    submitOrder,
    getCartItemsCount
  };
};
