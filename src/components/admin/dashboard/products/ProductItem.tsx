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
  onClick,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown
}) => {
  const baseClass = [
    "border",
    "rounded-xl", 
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
    <div className={baseClass} onClick={onClick}>
      {/* Layout Desktop: Grid a 4 colonne */}
      <div className="hidden md:grid md:grid-cols-[48px,72px,1fr,48px] md:items-center md:px-2 md:py-3 md:gap-3">
        {/* COLONNA 1: REORDER ARROWS - Desktop */}
        <div className="flex flex-col items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={e => {
              e.stopPropagation();
              onMoveUp();
            }}
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
            tabIndex={-1}
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>

        {/* COLONNA 2: PRODUCT IMAGE - Desktop */}
        <div className="flex-shrink-0 w-14 h-14 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="h-7 w-7 text-gray-400" />
          )}
        </div>

        {/* COLONNA 3: TEXTUAL INFO - Desktop */}
        <div className="flex flex-col flex-1 min-w-0 gap-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-900 truncate">{product.title}</span>
            {!product.is_active && (
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium">
                Non disponibile
              </span>
            )}
          </div>
          {product.description && (
            <span className="text-xs text-gray-500 line-clamp-2">{product.description}</span>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-sm text-gray-900">{Number(product.price_standard).toFixed(2)} €</span>
            {product.has_price_suffix && product.price_suffix && (
              <span className="text-xs text-gray-500">{product.price_suffix}</span>
            )}
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

        {/* COLONNA 4: AZIONI - Desktop */}
        <div className="flex flex-col items-center justify-between h-full pl-1 gap-2">
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

      {/* Layout Mobile: Stack verticale ottimizzato */}
      <div className="md:hidden p-3 space-y-2">
        {/* Header con immagine, titolo e prezzo */}
        <div className="flex items-start gap-3">
          {/* Immagine */}
          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
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

          {/* Colonna titolo e prezzo */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 leading-tight">{product.title}</h3>
            
            {/* Prezzo subito sotto il titolo */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-gray-900">
                {Number(product.price_standard).toFixed(2)} €
              </span>
              {product.has_price_suffix && product.price_suffix && (
                <span className="text-xs text-gray-500">{product.price_suffix}</span>
              )}
            </div>

            {!product.is_active && (
              <span className="inline-block text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium mt-1">
                Non disponibile
              </span>
            )}
          </div>
        </div>

        {/* Descrizione */}
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        )}

        {/* Footer con allergeni e controlli */}
        <div className="flex items-center justify-between">
          {/* Allergeni */}
          <div className="flex-1">
            {product.allergens && product.allergens.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.allergens.slice(0, 4).map((allergen) => (
                  <span 
                    key={allergen.id}
                    className="rounded-full bg-white border px-2 py-1 text-xs font-medium text-gray-700 shadow-sm"
                  >
                    {allergen.number}
                  </span>
                ))}
                {product.allergens.length > 4 && (
                  <span className="rounded-full bg-white border px-2 py-1 text-xs font-medium text-gray-700 shadow-sm">
                    +{product.allergens.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Azioni e controlli riordino */}
          <div className="flex items-center gap-1 ml-3">
            {/* Azioni Edit/Delete */}
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
              <Edit className="h-4 w-4" />
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
              <Trash2 className="h-4 w-4" />
            </Button>
            
            {/* Controlli riordino */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={e => {
                e.stopPropagation();
                onMoveUp();
              }}
              tabIndex={-1}
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={e => {
                e.stopPropagation();
                onMoveDown();
              }}
              tabIndex={-1}
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;