
import { useEffect } from "react";
import { useRestaurantLogo } from "./menu/useRestaurantLogo";

export const useMenuData = () => {
  const { restaurantLogo, updateRestaurantLogo } = useRestaurantLogo();

  // No need to load menu data for cover page only
  useEffect(() => {
    // This hook now only handles restaurant logo
  }, []);

  return {
    categories: [],
    products: {},
    allergens: [],
    labels: [],
    features: [],
    restaurantLogo,
    updateRestaurantLogo,
    isLoading: false,
    error: null,
    retryLoading: () => {},
    selectedCategories: [],
    setSelectedCategories: () => {},
    handleCategoryToggle: () => {},
    handleToggleAllCategories: () => {}
  };
};
