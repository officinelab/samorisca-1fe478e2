
// ProductsList standalone component
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, ArrowLeft, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoaderSkeleton from "@/components/dashboard/LoaderSkeleton";
import EmptyState from "@/components/dashboard/EmptyState";
import ProductCard from "@/components/dashboard/ProductCard";
import { Product } from "@/types/database";

interface ProductsListProps {
  products: Product[];
  selectedProduct: string | null;
  isLoading: boolean;
  searchQuery: string;
  onSearch: (v: string) => void;
  onSelect: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  isMobile?: boolean;
  onBack?: () => void;
  selectedCategory: string | null;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  selectedProduct,
  isLoading,
  searchQuery,
  onSearch,
  onSelect,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
  onNew,
  isMobile,
  onBack,
  selectedCategory,
}) => {
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="flex-1">
          <Input
            placeholder="Cerca prodotti..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="max-w-sm"
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <Button onClick={onNew} size="sm" className="ml-2">
          <PlusCircle className="h-4 w-4 mr-2" /> Nuovo
        </Button>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4">
          {!selectedCategory ? (
            <EmptyState message="Seleziona una categoria per visualizzare i prodotti." />
          ) : isLoading ? (
            <LoaderSkeleton lines={3} height="h-20" />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              message={
                searchQuery
                  ? "Nessun prodotto trovato per questa ricerca."
                  : "Nessun prodotto in questa categoria."
              }
            />
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selected={selectedProduct === product.id}
                  index={index}
                  total={filteredProducts.length}
                  onSelect={onSelect}
                  onMoveUp={() => onMoveUp(product.id)}
                  onMoveDown={() => onMoveDown(product.id)}
                  onEdit={() => onEdit(product.id)}
                  onDelete={() => onDelete(product.id)}
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProductsList;
