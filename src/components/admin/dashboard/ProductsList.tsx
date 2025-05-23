
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash, Plus, ArrowUp, ArrowDown, Check, X } from "lucide-react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Product, Category } from "@/types/database";

interface ProductsListProps {
  products: Product[];
  selectedProductId: string | null;
  selectedCategory: Category | null;
  isReorderingProducts: boolean;
  reorderingProductsList: Product[];
  onProductSelect: (productId: string) => void;
  onStartReordering: () => void;
  onCancelReordering: () => void;
  onMoveProduct: (index: number, direction: "up" | "down") => void;
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

  return (
    <Card className={dashboardStyles.card}>
      <CardHeader className={dashboardStyles.cardHeader}>
        <div className={dashboardStyles.cardHeaderContent}>
          <CardTitle className={dashboardStyles.cardTitle}>
            Prodotti
            {selectedCategory && <span className="text-sm font-normal ml-2">- {selectedCategory.title}</span>}
          </CardTitle>
          <div className="flex gap-2">
            {!isReorderingProducts ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onStartReordering}
                  disabled={products.length === 0}
                >
                  Riordina
                </Button>
                <Button 
                  size="sm" 
                  onClick={onAddProduct}
                  disabled={!selectedCategory}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Aggiungi
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={onCancelReordering}>
                  <X className="h-4 w-4 mr-2" />
                  Annulla
                </Button>
                <Button size="sm" onClick={onSaveReorder}>
                  <Check className="h-4 w-4 mr-2" />
                  Salva
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className={dashboardStyles.cardContent}>
        {!selectedCategory ? (
          <div className={dashboardStyles.emptyState}>
            <p>Seleziona una categoria per visualizzare i prodotti</p>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className={dashboardStyles.emptyState}>
            <p>Nessun prodotto disponibile in questa categoria</p>
          </div>
        ) : (
          <div className={dashboardStyles.productList}>
            {displayProducts.map((product, index) => (
              <div
                key={product.id}
                className={`${dashboardStyles.productItem} ${
                  selectedProductId === product.id ? dashboardStyles.productItemSelected : ''
                }`}
                onClick={() => !isReorderingProducts && onProductSelect(product.id)}
              >
                {isReorderingProducts && (
                  <div className="flex flex-col gap-1 mr-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveProduct(index, "up");
                      }}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveProduct(index, "down");
                      }}
                      disabled={index === displayProducts.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                <div className={dashboardStyles.productContent}>
                  <div className={dashboardStyles.productInfo}>
                    <span className={dashboardStyles.productTitle}>{product.title}</span>
                    {product.description && (
                      <span className={dashboardStyles.productDescription}>
                        {product.description}
                      </span>
                    )}
                  </div>
                  <div className={dashboardStyles.productBadges}>
                    <Badge variant="secondary" className={dashboardStyles.productBadge}>
                      Pos: {product.display_order}
                    </Badge>
                    <Badge 
                      variant={product.is_active ? "default" : "secondary"}
                      className={dashboardStyles.productBadge}
                    >
                      {product.is_active ? "Attivo" : "Inattivo"}
                    </Badge>
                    {product.price && (
                      <Badge variant="outline" className={dashboardStyles.productBadge}>
                        €{product.price}
                      </Badge>
                    )}
                  </div>
                </div>

                {!isReorderingProducts && (
                  <div className={dashboardStyles.productActions}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProduct(product);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Elimina prodotto</AlertDialogTitle>
                          <AlertDialogDescription>
                            Sei sicuro di voler eliminare il prodotto "{product.title}"? 
                            Questa azione non può essere annullata.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annulla</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteProduct(product.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Elimina
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductsList;
