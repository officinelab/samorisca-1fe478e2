
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, Edit, Trash2, Plus } from "lucide-react";
import { dashboardStyles } from "../Dashboard.styles";

interface Category {
  id: string;
  name: string;
  active: boolean;
  position: number;
}

interface CategoriesListProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onReorderCategory: (categoryId: string, direction: 'up' | 'down') => void;
  onAddCategory: () => void;
  loadingCategories: boolean;
}

export const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
  onEditCategory,
  onDeleteCategory,
  onReorderCategory,
  onAddCategory,
  loadingCategories
}) => {
  return (
    <div className={dashboardStyles.categoriesColumn}>
      <div className={dashboardStyles.categoriesHeader}>
        <h2 className={dashboardStyles.categoriesTitle}>Categorie</h2>
        <Button size="sm" onClick={onAddCategory}>
          <Plus className={dashboardStyles.buttonSm} />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {loadingCategories ? (
          <div className={dashboardStyles.loadingSpinner}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`${dashboardStyles.skeletonItem} animate-pulse bg-gray-200 rounded`} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className={dashboardStyles.emptyState}>
            Nessuna categoria disponibile
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className={`
                ${dashboardStyles.categoryItem}
                ${selectedCategoryId === category.id ? dashboardStyles.categoryItemSelected : ''}
                ${dashboardStyles.categoryItemHover}
                ${!category.active ? dashboardStyles.categoryItemInactive : ''}
              `}
              onClick={() => onCategorySelect(category.id)}
            >
              <div className={dashboardStyles.categoryContent}>
                <span className="font-medium">{category.name}</span>
                {!category.active && (
                  <Badge variant="secondary" className={dashboardStyles.categoryInactiveLabel}>
                    Non attiva
                  </Badge>
                )}
              </div>
              
              <div className={dashboardStyles.categoryActions}>
                <div className={dashboardStyles.categoryReorderActions}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={dashboardStyles.buttonSm}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderCategory(category.id, 'up');
                    }}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={dashboardStyles.buttonSm}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderCategory(category.id, 'down');
                    }}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className={dashboardStyles.buttonSm}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCategory(category);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className={dashboardStyles.buttonSm}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCategory(category.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
