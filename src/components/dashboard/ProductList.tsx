
import React from "react";
import { Product } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface ProductListProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEditProduct }) => {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white border rounded-md p-4 flex justify-between items-center">
          <div>
            <h3 className="font-medium">{product.title}</h3>
            {product.description && (
              <p className="text-sm text-gray-500">{product.description}</p>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEditProduct(product)}
            aria-label="Modifica prodotto"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
