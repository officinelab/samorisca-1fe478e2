
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category } from "@/types/database";

// DnD kit
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

import CategoriesHeader from "./categories/CategoriesHeader";
import CategoryItem from "./categories/CategoryItem";
import CategoryItemDraggable from "./categories/CategoryItemDraggable";
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

  // --- DRAG & DROP LOGIC ---
  const handleDragEnd = (event: any) => {
    if (!isReorderingCategories) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = reorderingCategoriesList.findIndex(c => c.id === active.id);
    const newIndex = reorderingCategoriesList.findIndex(c => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    // Calcola quante posizioni si è mosso e chiama onMoveCategory nel verso corretto finché non arrivi a destinazione
    const direction = newIndex > oldIndex ? "down" : "up";
    let times = Math.abs(newIndex - oldIndex);
    let currId = active.id;
    for (let i = 0; i < times; i++) {
      onMoveCategory(currId, direction as "up" | "down");
      const idx = reorderingCategoriesList.findIndex(c => c.id === currId);
      if (direction === "down") {
        currId = reorderingCategoriesList[idx + 1]?.id ?? currId;
      } else {
        currId = reorderingCategoriesList[idx - 1]?.id ?? currId;
      }
    }
  };

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
              isReorderingCategories ? (
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext
                    items={reorderingCategoriesList.map(c => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-1">
                      {reorderingCategoriesList.map((category, index) => (
                        <CategoryItemDraggable
                          key={category.id}
                          category={category}
                          index={index}
                          isSelected={selectedCategoryId === category.id}
                          onSelect={() => onCategorySelect(category.id)}
                          onEdit={() => onEditCategory(category)}
                          onDelete={() => handleDeleteClick(category.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="space-y-1">
                  {categories.map((category, index) => (
                    <CategoryItem
                      key={category.id}
                      category={category}
                      index={index}
                      totalCategories={categories.length}
                      isSelected={selectedCategoryId === category.id}
                      isReordering={false}
                      onSelect={() => onCategorySelect(category.id)}
                      onEdit={() => onEditCategory(category)}
                      onDelete={() => handleDeleteClick(category.id)}
                      onMoveUp={() => onMoveCategory(category.id, 'up')}
                      onMoveDown={() => onMoveCategory(category.id, 'down')}
                    />
                  ))}
                </div>
              )
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
