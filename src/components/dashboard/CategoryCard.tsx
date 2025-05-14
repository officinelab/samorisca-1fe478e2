
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronUp, ChevronDown, Package } from "lucide-react";
import { Category } from "@/types/database";

interface CategoryCardProps {
  category: Category;
  selected: boolean;
  index: number;
  total: number;
  onSelect: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  selected,
  index,
  total,
  onSelect,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}) => (
  <div
    className={`flex flex-col p-2 rounded-md cursor-pointer ${
      selected ? "bg-primary text-primary-foreground" : "hover:bg-gray-100"
    }`}
    onClick={() => onSelect(category.id)}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {category.image_url ? (
          <div className="w-8 h-8 rounded-md overflow-hidden">
            <img
              src={category.image_url}
              alt={category.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md">
            <Package className="h-4 w-4" />
          </div>
        )}
        <span className="truncate max-w-[120px]">{category.title}</span>
      </div>
      {!category.is_active && (
        <span className="text-sm px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
          Disattivata
        </span>
      )}
    </div>
    <div className="flex justify-end mt-2">
      <div className="flex mr-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp(category.id);
          }}
          disabled={index === 0}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown(category.id);
          }}
          disabled={index === total - 1}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
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

export default CategoryCard;
