
import React from "react";
import { Category } from "@/types/database";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Edit, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoriesListProps {
  categories: Category[];
  selectedCategoryId: string | null;
  isReorderingCategories: boolean;
  reorderingCategoriesList: Category[];
  onCategorySelect: (categoryId: string | null) => void;
  onStartReordering: () => void;
  onCancelReordering: () => void;
  onMoveCategory: (index: number, direction: 'up' | 'down') => void;
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
  const displayCategories = isReorderingCategories ? reorderingCategoriesList : categories;

  return (
    <div className={dashboardStyles.categoriesColumn}>
      <div className={dashboardStyles.categoriesHeader}>
        <h2 className={dashboardStyles.categoriesTitle}>Categorie</h2>
        <div className="flex gap-1">
          {!isReorderingCategories ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onStartReordering}
                title="Riordina categorie"
              >
                ↕️
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddCategory}
                title="Aggiungi categoria"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onSaveReorder}
                title="Salva ordine"
              >
                ✓
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCancelReordering}
                title="Annulla"
              >
                ✕
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {/* Categoria "Tutte" */}
        <div
          className={cn(
            dashboardStyles.categoryItem,
            !selectedCategoryId ? dashboardStyles.categoryItemSelected : dashboardStyles.categoryItemHover
          )}
          onClick={() => onCategorySelect(null)}
        >
          <div className={dashboardStyles.categoryContent}>
            <span>Tutte le categorie</span>
          </div>
        </div>

        {/* Lista categorie */}
        {displayCategories.map((category, index) => (
          <div
            key={category.id}
            className={cn(
              dashboardStyles.categoryItem,
              selectedCategoryId === category.id ? dashboardStyles.categoryItemSelected : dashboardStyles.categoryItemHover,
              !category.is_active && dashboardStyles.categoryItemInactive
            )}
            onClick={() => !isReorderingCategories && onCategorySelect(category.id)}
          >
            <div className={dashboardStyles.categoryContent}>
              <span>{category.title}</span>
              {!category.is_active && (
                <span className={dashboardStyles.categoryInactiveLabel}>
                  Disattiva
                </span>
              )}
            </div>

            {isReorderingCategories ? (
              <div className={dashboardStyles.categoryReorderActions}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={dashboardStyles.buttonSm}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveCategory(index, 'up');
                  }}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={dashboardStyles.buttonSm}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveCategory(index, 'down');
                  }}
                  disabled={index === displayCategories.length - 1}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className={dashboardStyles.categoryActions}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={dashboardStyles.buttonSm}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCategory(category);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={dashboardStyles.buttonSm}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCategory(category.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;
