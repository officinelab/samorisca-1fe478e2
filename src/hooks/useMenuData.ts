
import { useEffect } from "react";
import { useMenuDataLoading } from "./menu/useMenuDataLoading";
import { useRestaurantLogo } from "./menu/useRestaurantLogo";

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
    handleToggleAllCategories
  };
};
