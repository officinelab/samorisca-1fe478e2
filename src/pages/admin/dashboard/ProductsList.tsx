
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, Edit, Trash2, Plus, ImageIcon } from "lucide-react";
import { dashboardStyles } from "../Dashboard.styles";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  price_suffix: string;
  image_url: string;
  available: boolean;
  position: number;
  allergens: any[];
  features: any[];
}

interface ProductsListProps {
  products: Product[];
  selectedProductId: string | null;
  selectedCategoryName: string;
  onProductSelect: (productId: string) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onReorderProduct: (productId: string, direction: 'up' | 'down') => void;
  onAddProduct: () => void;
  loadingProducts: boolean;
}

export const ProductsList: React.FC<ProductsListProps> = ({
  products,
  selectedProductId,
  selectedCategoryName,
  onProductSelect,
  onEditProduct,
  onDeleteProduct,
  onReorderProduct,
  onAddProduct,
  loadingProducts
}) => {
  return (
    <div className={dashboardStyles.productsColumn}>
      <div className={dashboardStyles.productsHeader}>
        <h2 className="text-lg font-semibold">
          Prodotti {selectedCategoryName && `- ${selectedCategoryName}`}
        </h2>
        <Button size="sm" onClick={onAddProduct}>
          <Plus className={dashboardStyles.buttonSm} />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {loadingProducts ? (
          <div className={dashboardStyles.loadingSpinner}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`${dashboardStyles.skeletonProduct} animate-pulse bg-gray-200 rounded`} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className={dashboardStyles.emptyState}>
            {selectedCategoryName ? "Nessun prodotto in questa categoria" : "Seleziona una categoria"}
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className={`
                ${dashboardStyles.productItem}
                ${selectedProductId === product.id ? dashboardStyles.productItemSelected : ''}
                ${dashboardStyles.productItemHover}
                ${!product.available ? dashboardStyles.productItemInactive : ''}
              `}
              onClick={() => onProductSelect(product.id)}
            >
              <div className={dashboardStyles.productContent}>
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className={dashboardStyles.productImage}
                  />
                ) : (
                  <div className={dashboardStyles.productImagePlaceholder}>
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                
                <div className={dashboardStyles.productDetails}>
                  <div className="flex items-center space-x-2">
                    <h3 className={dashboardStyles.productTitle}>{product.name}</h3>
                    {!product.available && (
                      <Badge variant="secondary" className={dashboardStyles.productUnavailable}>
                        Non disponibile
                      </Badge>
                    )}
                  </div>
                  
                  {product.description && (
                    <p className={dashboardStyles.productDescription}>
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className={dashboardStyles.productPrice}>
                      €{product.price}
                      {product.price_suffix && (
                        <span className={dashboardStyles.productPriceSuffix}>
                          /{product.price_suffix}
                        </span>
                      )}
                    </span>
                    
                    {product.allergens?.length > 0 && (
                      <div className={dashboardStyles.productAllergens}>
                        {product.allergens.slice(0, 3).map((allergen, idx) => (
                          <span key={idx} className={dashboardStyles.productAllergenTag}>
                            {allergen.name}
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
                <div className={dashboardStyles.productReorderActions}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={dashboardStyles.buttonSm}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderProduct(product.id, 'up');
                    }}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={dashboardStyles.buttonSm}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderProduct(product.id, 'down');
                    }}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className={dashboardStyles.buttonSm}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProduct(product);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className={dashboardStyles.buttonSm}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProduct(product.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
