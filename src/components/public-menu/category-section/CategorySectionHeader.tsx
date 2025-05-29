
import React from 'react';
import { Category } from "@/types/database";

interface CategorySectionHeaderProps {
  category: Category;
  language?: string;
  categoryTitleStyle?: {
    fontFamily: string;
    fontWeight: "normal" | "bold";
    fontStyle: "normal" | "italic";
    backgroundColor: string;
    textColor: string;
  };
}

export const CategorySectionHeader: React.FC<CategorySectionHeaderProps> = ({
  category,
  language = 'it',
  categoryTitleStyle
}) => {
  // Usa la versione valorizzata da fetchMenuDataOptimized (displayTitle) o fallback su category.title
  const categoryTitle = category.displayTitle || category.title;

  const titleStyle = categoryTitleStyle ? {
    fontFamily: categoryTitleStyle.fontFamily,
    fontWeight: categoryTitleStyle.fontWeight,
    fontStyle: categoryTitleStyle.fontStyle,
    backgroundColor: categoryTitleStyle.backgroundColor,
    color: categoryTitleStyle.textColor,
    padding: categoryTitleStyle.backgroundColor !== "transparent" ? "0.5rem 1rem" : undefined,
    borderRadius: categoryTitleStyle.backgroundColor !== "transparent" ? "0.5rem" : undefined,
    display: "inline-block"
  } : {};

  return (
    <h2 
      className="text-2xl font-bold mb-4 text-center"
      style={titleStyle}
    >
      {categoryTitle}
    </h2>
  );
};
