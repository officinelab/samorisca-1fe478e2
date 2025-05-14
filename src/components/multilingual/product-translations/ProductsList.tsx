
import React from "react";
import { Product } from "@/types/database";

interface ProductsListProps {
  products: Product[];
  loadingProducts: boolean;
  selectedProductId: string | null;
  onProductSelect: (productId: string) => void;
}

export const ProductsList = ({
  products,
  loadingProducts,
  selectedProductId,
  onProductSelect
}: ProductsListProps) => {
  if (loadingProducts) {
    return <div>Caricamento prodotti...</div>;
  }
  
  if (products.length === 0) {
    return <div>Nessun prodotto in questa categoria</div>;
  }
  
  return (
    <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
      {products.map((product) => (
        <button
          key={product.id}
          className={`w-full text-left p-3 hover:bg-muted transition-colors ${
            selectedProductId === product.id ? 'bg-muted' : ''
          }`}
          onClick={() => onProductSelect(product.id)}
        >
          {product.title}
        </button>
      ))}
    </div>
  );
};
