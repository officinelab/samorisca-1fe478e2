
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronUp, ChevronDown, Package } from "lucide-react";
import { Product, Allergen } from "@/types/database";

interface ProductCardProps {
  product: Product;
  selected: boolean;
  index: number;
  total: number;
  onSelect: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  isMobile?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  selected,
  index,
  total,
  onSelect,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
  isMobile = false
}) => (
  <div
    className={`border rounded-md p-3 cursor-pointer transition-colors ${
      selected ? "border-primary bg-primary/5" : "hover:bg-gray-50"
    } ${!product.is_active ? "opacity-60" : ""}`}
    onClick={() => onSelect(product.id)}
  >
    <div className="flex space-x-3">
      {product.image_url ? (
        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md flex-shrink-0">
          <Package className="h-6 w-6 text-gray-400" />
        </div>
      )}
      <div className="flex-1">
        <h3 className="font-medium">{product.title}</h3>
        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center mt-1 space-x-2">
          <span className="text-sm font-semibold">{product.price_standard} €</span>
          {product.has_price_suffix && product.price_suffix && (
            <span className="text-xs text-gray-500">{product.price_suffix}</span>
          )}
          {!product.is_active && (
            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
              Non disponibile
            </span>
          )}
          {product.allergens && product.allergens.length > 0 && (
            <div className="flex space-x-1">
              {(product.allergens as Allergen[]).slice(0, 3).map((allergen) => (
                <span
                  key={allergen.id}
                  className="text-xs bg-gray-100 text-gray-700 px-1 rounded-full"
                >
                  {allergen.number}
                </span>
              ))}
              {product.allergens.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-700 px-1 rounded-full">
                  +{product.allergens.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="flex justify-end mt-2">
      <div className="flex mr-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp(product.id);
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
            onMoveDown(product.id);
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

export default ProductCard;
