
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Category } from "@/types/database";

interface CategoryItemDraggableProps {
  category: Category;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryItemDraggable: React.FC<CategoryItemDraggableProps> = ({
  category,
  index,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${dashboardStyles.categoryItem} ${
        isSelected
          ? dashboardStyles.categoryItemSelected
          : dashboardStyles.categoryItemHover
      } ${!category.is_active ? dashboardStyles.categoryItemInactive : ""}`}
      onClick={onSelect}
      {...attributes}
    >
      <div className={`flex items-center space-x-2`}>
        <span 
          {...listeners} // handle drag gesture
          className="cursor-grab active:cursor-grabbing text-gray-400 flex items-center"
        >
          <GripVertical className="h-5 w-5 mr-1" />
        </span>
        <span className="truncate max-w-[140px]">{category.title}</span>
        {!category.is_active && (
          <span className={dashboardStyles.categoryInactiveLabel}>
            Disattivata
          </span>
        )}
      </div>
      <div className={dashboardStyles.categoryActions}>
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
      </div>
    </div>
  );
};

export default CategoryItemDraggable;
