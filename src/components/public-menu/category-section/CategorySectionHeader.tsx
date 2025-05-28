
import React from 'react';
import { Category } from "@/types/database";

interface CategorySectionHeaderProps {
  category: Category;
  language?: string;
}

export const CategorySectionHeader: React.FC<CategorySectionHeaderProps> = ({ 
  category, 
  language = 'it' 
}) => {
  // Usa la versione valorizzata da fetchMenuDataOptimized (displayTitle) o fallback su category.title
  const categoryTitle = category.displayTitle || category.title;

  return (
    <h2 className="text-2xl font-bold mb-4">{categoryTitle}</h2>
  );
};
