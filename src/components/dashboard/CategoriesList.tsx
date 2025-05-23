
import React from "react";
import { Category } from "@/types/database";
import CategoryRow from "./CategoryRow";

interface CategoriesListProps {
  categories: Category[];
  onReorderCategory: (categoryId: string, direction: 'up' | 'down') => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
  onReorderCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  return (
    <div className="space-y-2">
      {categories.map((category, index) => (
        <CategoryRow
          key={category.id}
          category={category}
          canMoveUp={index > 0}
          canMoveDown={index < categories.length - 1}
          onMoveUp={() => onReorderCategory(category.id, 'up')}
          onMoveDown={() => onReorderCategory(category.id, 'down')}
          onEdit={() => onEditCategory(category)}
          onDelete={() => onDeleteCategory(category.id)}
        />
      ))}
    </div>
  );
};

export default CategoriesList;
