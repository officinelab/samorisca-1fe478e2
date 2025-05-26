
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Search,
  ChevronUp, 
  ChevronDown,
  Package,
  Settings,
  Save,
  X
} from "lucide-react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Product, Category } from "@/types/database";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductsListProps {
  products: Product[];
  selectedProductId: string | null;
  selectedCategory: Category | null;
  isReorderingProducts: boolean;
  reorderingProductsList: Product[];
  onProductSelect: (productId: string) => void;
  onStartReordering: () => void;
  onCancelReordering: () => void;
  onMoveProduct: (productId: string, direction: 'up' | 'down') => void;
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
  const [searchQuery, setSearchQuery] = React.useState("");
  const [productToDelete, setProductToDelete] = React.useState<string | null>(null);

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete);
      setProductToDelete(null);
    }
  };

  const displayProducts = isReorderingProducts ? reorderingProductsList : products;
  const filteredProducts = displayProducts.filter(
    product => product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="h-full flex flex-col">
        <div className={dashboardStyles.productsHeader}>
          <div className="flex-1 flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca prodotti..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
                disabled={isReorderingProducts}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            {!isReorderingProducts ? (
              <>
                <Button onClick={onStartReordering} size="sm" variant="outline" disabled={products.length === 0}>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  onClick={onAddProduct}
                  size="sm"
                  disabled={!selectedCategory}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Nuovo
                </Button>
              </>
            ) : (
              <>
                <Button onClick={onCancelReordering} size="sm" variant="outline">
                  <X className="h-4 w-4" />
                </Button>
                <Button onClick={onSaveReorder} size="sm">
                  <Save className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        
        <ScrollArea className="flex-grow">
          <div className="p-4">
            {!selectedCategory ? (
              <div className={dashboardStyles.emptyState}>
                Seleziona una categoria per visualizzare i prodotti.
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className={dashboardStyles.emptyState}>
                {searchQuery ? 
                  "Nessun prodotto trovato per questa ricerca." : 
                  "Nessun prodotto in questa categoria."}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`${dashboardStyles.productItem} ${
                      selectedProductId === product.id 
                        ? dashboardStyles.productItemSelected
                        : dashboardStyles.productItemHover
                    } ${!product.is_active ? dashboardStyles.productItemInactive : ""}`}
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
                      {isReorderingProducts ? (
                        <div className={dashboardStyles.productReorderActions}>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={dashboardStyles.buttonSm}
                            onClick={(e) => {
                              e.stopPropagation();
                              onMoveProduct(product.id, 'up');
                            }}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={dashboardStyles.buttonSm}
                            onClick={(e) => {
                              e.stopPropagation();
                              onMoveProduct(product.id, 'down');
                            }}
                            disabled={index === filteredProducts.length - 1}
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
                              onEditProduct(product);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(product.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Dialog Conferma Eliminazione Prodotto */}
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di voler eliminare questa voce del menu?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductsList;
