
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PlusCircle, 
  Search,
  Settings,
  Save,
  X
} from "lucide-react";
import { Category } from "@/types/database";

interface ProductsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchDisabled: boolean;
  selectedCategory: Category | null;
  isReordering: boolean;
  hasProducts: boolean;
  onStartReordering: () => void;
  onCancelReordering: () => void;
  onSaveReorder: () => void;
  onAddProduct: () => void;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  searchQuery,
  onSearchChange,
  searchDisabled,
  selectedCategory,
  isReordering,
  hasProducts,
  onStartReordering,
  onCancelReordering,
  onSaveReorder,
  onAddProduct
}) => {
  return (
    <div className="p-4 border-b bg-background">
      <div className="flex-1 flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca prodotti..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
            disabled={searchDisabled}
          />
        </div>
      </div>
      <div className="flex space-x-2 mt-2">
        {!isReordering ? (
          <>
            <Button onClick={onStartReordering} size="sm" variant="outline" disabled={!hasProducts}>
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
  );
};

export default ProductsHeader;
