
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Package
} from "lucide-react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Product } from "@/types/database";

interface ProductItemProps {
  product: Product;
  isSelected: boolean;
  isReordering: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  isSelected,
  isReordering,
  canMoveUp,
  canMoveDown,
  onClick,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown
}) => {
  // CLASSES
  const baseClass = [
    "flex",
    "items-center",
    "border",
    "rounded-xl",
    "px-4",
    "py-3",
    "gap-3",
    "transition-colors",
    "bg-gray-50",
    "shadow-sm",
    isSelected
      ? "border-primary bg-primary/5"
      : "hover:bg-gray-100 border-gray-200",
    !product.is_active ? "opacity-60" : "",
    "w-full"
  ].join(" ");

  return (
    <div className={baseClass} onClick={() => !isReordering && onClick()}>
      {/* COLONNA 1: REORDER ARROWS */}
      <div className="flex flex-col items-center justify-center pr-2 gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={e => {
            e.stopPropagation();
            onMoveUp();
          }}
          disabled={isReordering ? !canMoveUp : true}
          tabIndex={-1}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={e => {
            e.stopPropagation();
            onMoveDown();
          }}
          disabled={isReordering ? !canMoveDown : true}
          tabIndex={-1}
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>

      {/* COLONNA 2: PRODUCT IMAGE */}
      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center mr-2">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package className="h-8 w-8 text-gray-400" />
        )}
      </div>

      {/* COLONNA 3: TESTUAL INFO */}
      <div className="flex flex-col flex-1 min-w-0 gap-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-gray-900 truncate">{product.title}</span>
          {product.has_price_suffix && product.price_suffix && (
            <span className="text-xs text-gray-500">{product.price_suffix}</span>
          )}
          {!product.is_active && (
            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium ml-1">
              Non disponibile
            </span>
          )}
        </div>
        {product.description && (
          <span className="text-sm text-gray-500 line-clamp-2">{product.description}</span>
        )}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="text-base font-semibold text-gray-900">{Number(product.price_standard).toFixed(2)} €</span>
          {product.allergens && product.allergens.length > 0 && (
            <div className="flex gap-1">
              {product.allergens.slice(0, 3).map((allergen) => (
                <span 
                  key={allergen.id}
                  className="rounded-full bg-white border px-2 py-0.5 text-xs font-medium text-gray-700 shadow"
                >
                  {allergen.number}
                </span>
              ))}
              {product.allergens.length > 3 && (
                <span className="rounded-full bg-white border px-2 py-0.5 text-xs font-medium text-gray-700 shadow">
                  +{product.allergens.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* COLONNA 4: AZIONI (EDIT, DELETE)*/}
      <div className="flex flex-col items-center justify-between h-full pl-2 gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={e => {
            e.stopPropagation();
            onEdit();
          }}
          tabIndex={-1}
        >
          <Edit className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          tabIndex={-1}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ProductItem;
