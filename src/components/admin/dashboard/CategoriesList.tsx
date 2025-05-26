
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category } from "@/types/database";

// Imported components
import CategoriesHeader from "./categories/CategoriesHeader";
import CategoryItem from "./categories/CategoryItem";
import CategoriesEmptyState from "./categories/CategoriesEmptyState";
import CategoryDeleteDialog from "./categories/CategoryDeleteDialog";

interface CategoriesListProps {
  categories: Category[];
  selectedCategoryId: string | null;
  isReorderingCategories: boolean;
  reorderingCategoriesList: Category[];
  onCategorySelect: (categoryId: string) => void;
  onStartReordering: () => void;
  onCancelReordering: () => void;
  onMoveCategory: (categoryId: string, direction: 'up' | 'down') => void;
  onSaveReorder: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddCategory: () => void;
}

const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
  selectedCategoryId,
  isReorderingCategories,
  reorderingCategoriesList,
  onCategorySelect,
  onStartReordering,
  onCancelReordering,
  onMoveCategory,
  onSaveReorder,
  onEditCategory,
  onDeleteCategory,
  onAddCategory
}) => {
  const [categoryToDelete, setCategoryToDelete] = React.useState<string | null>(null);

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setCategoryToDelete(null);
  };

  const displayCategories = isReorderingCategories ? reorderingCategoriesList : categories;

  return (
    <>
      <div className="h-full flex flex-col">
        <CategoriesHeader
          isReordering={isReorderingCategories}
          onStartReordering={onStartReordering}
          onCancelReordering={onCancelReordering}
          onSaveReorder={onSaveReorder}
          onAddCategory={onAddCategory}
        />
        
        <ScrollArea className="flex-grow">
          <div className="p-2">
            {categories.length === 0 ? (
              <CategoriesEmptyState />
            ) : (
              <div className="space-y-1">
                {displayCategories.map((category, index) => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    index={index}
                    totalCategories={displayCategories.length}
                    isSelected={selectedCategoryId === category.id}
                    isReordering={isReorderingCategories}
                    onSelect={() => onCategorySelect(category.id)}
                    onEdit={() => onEditCategory(category)}
                    onDelete={() => handleDeleteClick(category.id)}
                    onMoveUp={() => onMoveCategory(category.id, 'up')}
                    onMoveDown={() => onMoveCategory(category.id, 'down')}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <CategoryDeleteDialog
        isOpen={!!categoryToDelete}
        onClose={handleCloseDeleteDialog}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default CategoriesList;
