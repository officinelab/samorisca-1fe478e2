
import React from "react";

interface ProductEmptyStateProps {
  isLoading: boolean;
  noCategory: boolean;
  hasSearchQuery: boolean;
  hasProducts: boolean;
}

const ProductEmptyState: React.FC<ProductEmptyStateProps> = ({
  isLoading,
  noCategory,
  hasSearchQuery,
  hasProducts
}) => {
  if (noCategory) {
    return (
      <div className="text-center py-8 text-gray-500">
        Seleziona una categoria per visualizzare i prodotti.
      </div>
    );
  }
  
  if (!isLoading && !hasProducts) {
    return (
      <div className="text-center py-8 text-gray-500">
        {hasSearchQuery ? 
          "Nessun prodotto trovato per questa ricerca." : 
          "Nessun prodotto in questa categoria."}
      </div>
    );
  }
  
  return null;
};

export default ProductEmptyState;
