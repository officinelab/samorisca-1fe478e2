
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Edit, Trash2 } from "lucide-react";
import { Category } from "@/types/database";

interface CategoryRowProps {
  category: Category;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
      {/* Colonna 1: Frecce di ordinamento */}
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="h-6 w-6 p-0"
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="h-6 w-6 p-0"
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      {/* Colonna 2: Titolo categoria */}
      <div className="flex-1 mx-4">
        <span className="font-medium text-gray-900">{category.title}</span>
      </div>

      {/* Colonna 3: Icone di azione */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CategoryRow;
