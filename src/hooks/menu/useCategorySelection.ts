
import { useState } from "react";
import { Category } from "@/types/database";

export const useCategorySelection = (categories: Category[]) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Initialize selected categories with all active categories
  const initializeSelectedCategories = (categories: Category[]) => {
    setSelectedCategories(categories.map(c => c.id));
  };

  // Handle toggling a single category selection
  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  // Handle toggling all categories selection
  const handleToggleAllCategories = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(c => c.id));
    }
  };

  return {
    selectedCategories,
    setSelectedCategories,
    initializeSelectedCategories,
    handleCategoryToggle,
    handleToggleAllCategories
  };
};
