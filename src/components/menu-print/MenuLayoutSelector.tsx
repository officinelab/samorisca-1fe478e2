
import React from 'react';
import { Category, Product, Allergen } from "@/types/database";
import ClassicLayout from "./ClassicLayout";
import ModernLayout from "./ModernLayout";
import AllergensLayout from "./AllergensLayout";

type MenuLayoutSelectorProps = {
  selectedLayout: string;
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  allergens: Allergen[];
  printAllergens: boolean;
};

const MenuLayoutSelector: React.FC<MenuLayoutSelectorProps> = ({
  selectedLayout,
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  categories,
  products,
  selectedCategories,
  language,
  allergens,
  printAllergens,
}) => {
  switch (selectedLayout) {
    case "modern":
      return (
        <ModernLayout
          A4_WIDTH_MM={A4_WIDTH_MM}
          A4_HEIGHT_MM={A4_HEIGHT_MM}
          showPageBoundaries={showPageBoundaries}
          categories={categories}
          products={products}
          selectedCategories={selectedCategories}
          language={language}
          allergens={allergens}
          printAllergens={printAllergens}
        />
      );
    case "allergens":
      return (
        <AllergensLayout
          A4_WIDTH_MM={A4_WIDTH_MM}
          A4_HEIGHT_MM={A4_HEIGHT_MM}
          showPageBoundaries={showPageBoundaries}
          allergens={allergens}
        />
      );
    case "classic":
    default:
      return (
        <ClassicLayout
          A4_WIDTH_MM={A4_WIDTH_MM}
          A4_HEIGHT_MM={A4_HEIGHT_MM}
          showPageBoundaries={showPageBoundaries}
          categories={categories}
          products={products}
          selectedCategories={selectedCategories}
          language={language}
          allergens={allergens}
          printAllergens={printAllergens}
        />
      );
  }
};

export default MenuLayoutSelector;
