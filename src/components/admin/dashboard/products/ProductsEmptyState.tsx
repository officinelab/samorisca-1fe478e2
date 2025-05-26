
import React from "react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Category } from "@/types/database";

interface ProductsEmptyStateProps {
  selectedCategory: Category | null;
  hasSearchQuery: boolean;
}

const ProductsEmptyState: React.FC<ProductsEmptyStateProps> = ({
  selectedCategory,
  hasSearchQuery
}) => {
  if (!selectedCategory) {
    return (
      <div className={dashboardStyles.emptyState}>
        Seleziona una categoria per visualizzare i prodotti.
      </div>
    );
  }

  if (hasSearchQuery) {
    return (
      <div className={dashboardStyles.emptyState}>
        Nessun prodotto trovato per questa ricerca.
      </div>
    );
  }

  return (
    <div className={dashboardStyles.emptyState}>
      Nessun prodotto in questa categoria.
    </div>
  );
};

export default ProductsEmptyState;
