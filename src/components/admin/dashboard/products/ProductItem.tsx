
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
  return (
    <div
      className={`${dashboardStyles.productItem} ${
        isSelected 
          ? dashboardStyles.productItemSelected
          : dashboardStyles.productItemHover
      } ${!product.is_active ? dashboardStyles.productItemInactive : ""}`}
      onClick={() => !isReordering && onClick()}
    >
      <div className={dashboardStyles.productContent}>
        {product.image_url ? (
          <div className={dashboardStyles.productImage}>
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className={dashboardStyles.productImagePlaceholder}>
            <Package className="h-6 w-6 text-gray-400" />
          </div>
        )}
        
        <div className={dashboardStyles.productDetails}>
          <h3 className={dashboardStyles.productTitle}>{product.title}</h3>
          {product.description && (
            <p className={dashboardStyles.productDescription}>{product.description}</p>
          )}
          
          <div className="flex items-center mt-1 space-x-2">
            <span className={dashboardStyles.productPrice}>{product.price_standard} €</span>
            {product.has_price_suffix && product.price_suffix && (
              <span className={dashboardStyles.productPriceSuffix}>{product.price_suffix}</span>
            )}
            
            {!product.is_active && (
              <span className={dashboardStyles.productUnavailable}>
                Non disponibile
              </span>
            )}
            
            {product.allergens && product.allergens.length > 0 && (
              <div className={dashboardStyles.productAllergens}>
                {product.allergens.slice(0, 3).map((allergen) => (
                  <span 
                    key={allergen.id}
                    className={dashboardStyles.productAllergenTag}
                  >
                    {allergen.number}
                  </span>
                ))}
                {product.allergens.length > 3 && (
                  <span className={dashboardStyles.productAllergenTag}>
                    +{product.allergens.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className={dashboardStyles.productActions}>
        {isReordering ? (
          <div className={dashboardStyles.productReorderActions}>
            <Button 
              variant="ghost" 
              size="sm"
              className={dashboardStyles.buttonSm}
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              disabled={!canMoveUp}
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
              disabled={!canMoveDown}
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

export default ProductItem;
