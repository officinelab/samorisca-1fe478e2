
import { useEffect, useState } from "react";
import { useMenuDataLoading } from "./menu/useMenuDataLoading";
import { useRestaurantLogo } from "./menu/useRestaurantLogo";
import { Product } from "@/types/database";

export const useMenuData = () => {
  const {
    categories,
    products,
    allergens,
    labels,
    features,
    isLoading,
    error,
    loadData,
    retryLoading,
    selectedCategories,
    setSelectedCategories,
    handleCategoryToggle,
    handleToggleAllCategories
  } = useMenuDataLoading();

  const { restaurantLogo, updateRestaurantLogo } = useRestaurantLogo();
  
  // Stato per il prodotto selezionato
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Funzione per selezionare un prodotto
  const selectProduct = (product: Product | null) => {
    setSelectedProduct(product);
  };

  // Funzione per ottenere un riferimento al fetchMenuData originale
  const fetchMenuData = () => {
    loadData();
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  return {
    categories,
    products,
    allergens,
    labels,
    features,
    restaurantLogo,
    updateRestaurantLogo,
    isLoading,
    error,
    retryLoading,
    selectedCategories,
    setSelectedCategories,
    handleCategoryToggle,
    handleToggleAllCategories,
    selectedProduct,
    selectProduct,
    fetchMenuData
  };
};
