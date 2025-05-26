
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash2, 
  ChevronUp, 
  ChevronDown
} from "lucide-react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Category } from "@/types/database";

interface CategoryItemProps {
  category: Category;
  index: number;
  totalCategories: number;
  isSelected: boolean;
  isReordering: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  index,
  totalCategories,
  isSelected,
  isReordering,
  onSelect,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown
}) => {
  return (
    <div
      className={`${dashboardStyles.categoryItem} ${
        isSelected
          ? dashboardStyles.categoryItemSelected
          : dashboardStyles.categoryItemHover
      } ${!category.is_active ? dashboardStyles.categoryItemInactive : ""}`}
      onClick={() => !isReordering && onSelect()}
    >
      <div className={dashboardStyles.categoryContent}>
        <div className="flex items-center space-x-2">
          <span className="truncate max-w-[140px]">{category.title}</span>
        </div>
        {!category.is_active && (
          <span className={dashboardStyles.categoryInactiveLabel}>
            Disattivata
          </span>
        )}
      </div>
      
      <div className={dashboardStyles.categoryActions}>
        {isReordering ? (
          <div className={dashboardStyles.categoryReorderActions}>
            <Button 
              variant="ghost" 
              size="sm"
              className={dashboardStyles.buttonSm}
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              disabled={index === 0}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={dashboardStyles.buttonSm}
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              disabled={index === totalCategories - 1}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryItem;
