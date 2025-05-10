
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, ArrowLeft } from "lucide-react";

interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddProduct: () => void;
  onBackToCategories?: () => void;
  isMobile?: boolean;
  noCategory?: boolean;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  searchQuery,
  onSearchChange,
  onAddProduct,
  onBackToCategories,
  isMobile = false,
  noCategory = false
}) => {
  return (
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
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
          icon={<Search className="h-4 w-4" />}
        />
      </div>
      <Button
        onClick={onAddProduct}
        size="sm"
        className="ml-2"
        disabled={noCategory}
      >
        <PlusCircle className="h-4 w-4 mr-2" /> Nuovo
      </Button>
    </div>
  );
};

export default ProductSearch;
