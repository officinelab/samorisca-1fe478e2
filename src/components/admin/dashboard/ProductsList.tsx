
import React from "react";
import { Product, Category } from "@/types/database";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Edit, Trash2, Plus, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductsListProps {
  products: Product[];
  selectedProductId: string | null;
  selectedCategory: Category | null;
  isReorderingProducts: boolean;
  reorderingProductsList: Product[];
  onProductSelect: (productId: string | null) => void;
  onStartReordering: () => void;
  onCancelReordering: () => void;
  onMoveProduct: (index: number, direction: 'up' | 'down') => void;
  onSaveReorder: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: () => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  selectedProductId,
  selectedCategory,
  isReorderingProducts,
  reorderingProductsList,
  onProductSelect,
  onStartReordering,
  onCancelReordering,
  onMoveProduct,
  onSaveReorder,
  onEditProduct,
  onDeleteProduct,
  onAddProduct
}) => {
  const displayProducts = isReorderingProducts ? reorderingProductsList : products;

  const formatPrice = (product: Product) => {
    if (product.has_multiple_prices) {
      if (product.price_variant_1_value && product.price_variant_2_value) {
        return `€${product.price_variant_1_value} / €${product.price_variant_2_value}`;
      }
    }
    if (product.price_standard) {
      const priceText = `€${product.price_standard}`;
      return product.has_price_suffix && product.price_suffix 
        ? `${priceText} ${product.price_suffix}` 
        : priceText;
    }
    return "Prezzo non impostato";
  };

  return (
    <div className={dashboardStyles.productsColumn}>
      <div className={dashboardStyles.productsHeader}>
        <h2 className={dashboardStyles.categoriesTitle}>
          Prodotti {selectedCategory && `- ${selectedCategory.title}`}
        </h2>
        <div className="flex gap-1">
          {!isReorderingProducts ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onStartReordering}
                title="Riordina prodotti"
                disabled={displayProducts.length === 0}
              >
                ↕️
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddProduct}
                title="Aggiungi prodotto"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onSaveReorder}
                title="Salva ordine"
              >
                ✓
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCancelReordering}
                title="Annulla"
              >
                ✕
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {displayProducts.length === 0 ? (
          <div className={dashboardStyles.emptyState}>
            <p>Nessun prodotto trovato</p>
            {selectedCategory && (
              <p className="text-sm">per la categoria "{selectedCategory.title}"</p>
            )}
          </div>
        ) : (
          displayProducts.map((product, index) => (
            <div
              key={product.id}
              className={cn(
                dashboardStyles.productItem,
                selectedProductId === product.id ? dashboardStyles.productItemSelected : dashboardStyles.productItemHover,
                !product.is_active && dashboardStyles.productItemInactive
              )}
              onClick={() => !isReorderingProducts && onProductSelect(product.id)}
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
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                )}

                <div className={dashboardStyles.productDetails}>
                  <h3 className={dashboardStyles.productTitle}>{product.title}</h3>
                  {product.description && (
                    <p className={dashboardStyles.productDescription}>
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className={dashboardStyles.productPrice}>
                      {formatPrice(product)}
                    </span>
                    {!product.is_active && (
                      <span className={dashboardStyles.productUnavailable}>
                        Non disponibile
                      </span>
                    )}
                  </div>
                  
                  {product.allergens && product.allergens.length > 0 && (
                    <div className={dashboardStyles.productAllergens}>
                      {product.allergens.slice(0, 3).map((allergen: any) => (
                        <span key={allergen.id} className={dashboardStyles.productAllergenTag}>
                          {allergen.number && `${allergen.number}. `}{allergen.title}
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

              {isReorderingProducts ? (
                <div className={dashboardStyles.productReorderActions}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={dashboardStyles.buttonSm}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveProduct(index, 'up');
                    }}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={dashboardStyles.buttonSm}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveProduct(index, 'down');
                    }}
                    disabled={index === displayProducts.length - 1}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className={dashboardStyles.productActions}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={dashboardStyles.buttonSm}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProduct(product);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={dashboardStyles.buttonSm}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProduct(product.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsList;
