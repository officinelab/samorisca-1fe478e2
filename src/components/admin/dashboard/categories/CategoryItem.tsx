
import React, { useRef } from "react";
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

const MOVE_CONTINUOUS_INTERVAL = 220;

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
  // Ref per gestire l'interval
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Gestione movimento continuo
  const handleContinuousMove = (
    moveFn: () => void,
    canMove: boolean
  ) => {
    if (!canMove) return;
    moveFn(); // Prima chiamata immediata
    moveIntervalRef.current = setInterval(() => {
      moveFn();
    }, MOVE_CONTINUOUS_INTERVAL);
  };

  const stopContinuousMove = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  };

  // Evidenza categoria selezionata e animazioni
  const getItemClass = () => {
    let c = `${dashboardStyles.categoryItem} transition-[border,box-shadow] duration-150 ease-in`;
    if (isSelected && isReordering) {
      c += " border-2 border-blue-500 shadow-md bg-blue-50";
    } else if (isSelected) {
      c += ` ${dashboardStyles.categoryItemSelected}`;
    } else {
      c += ` ${dashboardStyles.categoryItemHover}`;
    }
    if (!category.is_active) c += ` ${dashboardStyles.categoryItemInactive}`;
    return c;
  };

  // Fixed: Get appropriate icon color based on selection state
  const getIconColor = () => {
    if (isSelected && !isReordering) {
      return "text-white"; // White icons on selected category
    }
    return "text-gray-600"; // Default gray icons
  };

  return (
    <div
      className={getItemClass()}
      style={{
        transition: "transform 0.18s cubic-bezier(0.4,0,0.2,1)"
      }}
      onClick={() => !isReordering && onSelect()}
      tabIndex={isReordering ? 0 : undefined}
      aria-selected={isSelected}
    >
      {/* Container con 2 colonne */}
      <div className="flex justify-between items-center gap-2">
        {/* Colonna 1: Titolo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {/* Testo che va a capo invece di truncate */}
            <span className="break-words">{category.title}</span>
          </div>
          {!category.is_active && (
            <span className={`${dashboardStyles.categoryInactiveLabel} ${isSelected ? 'bg-white/20 text-white' : ''}`}>
              Disattivata
            </span>
          )}
        </div>
        
        {/* Colonna 2: Azioni */}
        <div className="flex-shrink-0">
          {isReordering ? (
            <div className="flex flex-col space-y-1">
              <Button 
                variant="ghost" 
                size="sm"
                className={`${dashboardStyles.buttonSm} 
                  ${index === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-blue-100 hover:text-blue-800"}
                  transition-colors ${getIconColor()}`}
                onMouseDown={e => {
                  e.stopPropagation();
                  handleContinuousMove(onMoveUp, index > 0);
                }}
                onMouseUp={stopContinuousMove}
                onMouseLeave={stopContinuousMove}
                onTouchEnd={stopContinuousMove}
                onClick={e => {
                  e.stopPropagation();
                  onMoveUp();
                }}
                disabled={index === 0}
                aria-label="Sposta su"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`${dashboardStyles.buttonSm} 
                  ${index === totalCategories - 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-blue-100 hover:text-blue-800"}
                  transition-colors ${getIconColor()}`}
                onMouseDown={e => {
                  e.stopPropagation();
                  handleContinuousMove(onMoveDown, index < totalCategories - 1);
                }}
                onMouseUp={stopContinuousMove}
                onMouseLeave={stopContinuousMove}
                onTouchEnd={stopContinuousMove}
                onClick={e => {
                  e.stopPropagation();
                  onMoveDown();
                }}
                disabled={index === totalCategories - 1}
                aria-label="Sposta giù"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-1">
              <Button 
                variant="ghost" 
                size="sm"
                className={getIconColor()}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                aria-label="Modifica categoria"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={getIconColor()}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                aria-label="Elimina categoria"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryItem;
