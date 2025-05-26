
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PlusCircle, 
  Search,
} from "lucide-react";
import { Category } from "@/types/database";

interface ProductsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchDisabled: boolean;
  selectedCategory: Category | null;
  onAddProduct: () => void;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  searchQuery,
  onSearchChange,
  searchDisabled,
  selectedCategory,
  onAddProduct
}) => {
  return (
    <div className="p-4 border-b bg-background flex flex-col md:flex-row md:items-center md:justify-between gap-2">
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
      <div className="flex space-x-2">
        <Button
          onClick={onAddProduct}
          size="sm"
          disabled={!selectedCategory}
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Nuovo
        </Button>
      </div>
    </div>
  );
};

export default ProductsHeader;
