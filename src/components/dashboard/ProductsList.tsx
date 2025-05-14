
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, ChevronUp, ChevronDown, Edit, Trash2, PlusCircle, ArrowLeft, Search } from "lucide-react";

interface Product {
  id: string;
  title: string;
  description?: string;
  is_active?: boolean;
  image_url?: string | null;
  price_standard?: number;
  has_price_suffix?: boolean;
  price_suffix?: string | null;
  has_multiple_prices?: boolean;
  price_variant_1_name?: string | null;
  price_variant_1_value?: number | null;
  price_variant_2_name?: string | null;
  price_variant_2_value?: number | null;
  allergens?: any[];
}

interface ProductsListProps {
  products: Product[];
  selectedProduct: string | null;
  searchQuery: string;
  onSelectProduct: (id: string) => void;
  isLoadingProducts: boolean;
  onProductReorder: (id: string, dir: 'up' | 'down') => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddProduct: () => void;
  isMobile: boolean;
  setSearchQuery: (q: string) => void;
  onBackToCategories?: () => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  selectedProduct,
  searchQuery,
  onSelectProduct,
  isLoadingProducts,
  onProductReorder,
  onEdit,
  onDelete,
  onAddProduct,
  isMobile,
  setSearchQuery,
  onBackToCategories,
}) => {
  const filteredProducts = products.filter(
    product => product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        {isMobile && onBackToCategories && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={onBackToCategories}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="flex-1">
          <Input
            placeholder="Cerca prodotti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <Button
          onClick={onAddProduct}
          size="sm"
          className="ml-2"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Nuovo
        </Button>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4">
          {isLoadingProducts ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 
                "Nessun prodotto trovato per questa ricerca." : 
                "Nessun prodotto in questa categoria."}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`border rounded-md p-3 cursor-pointer transition-colors ${
                    selectedProduct === product.id 
                      ? "border-primary bg-primary/5" 
                      : "hover:bg-gray-50"
                  } ${!product.is_active ? "opacity-60" : ""}`}
                  onClick={() => onSelectProduct(product.id)}
                >
                  <div className="flex space-x-3">
                    {product.image_url ? (
                      <div className="w-16 h-16 rounded-md overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md flex-shrink-0">
                        <Package className="h-10 w-10 text-gray-400" />
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
                            {product.allergens.slice(0, 3).map((allergen) => (
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
                          onProductReorder(product.id, 'up');
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
                          onProductReorder(product.id, 'down');
                        }}
                        disabled={index === filteredProducts.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(product.id);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(product.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProductsList;
