
import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types/database";
import { useProductLoader } from "./product-actions/useProductLoader";
import { useProductSelection } from "./product-actions/useProductSelection";
import { useProductFiltering } from "./product-actions/useProductFiltering";
import { useProductReordering } from "./product-actions/useProductReordering";
import { useProductCRUD } from "./product-actions/useProductCRUD";

export const useProducts = (categoryId: string | null) => {
  // State for product data and UI state
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Load products for the selected category
  const { products, isLoadingProducts, loadProducts } = useProductLoader();
  
  // Product selection
  const { selectedProductId, selectProduct } = useProductSelection();
  
  // Product filtering
  const { searchQuery: filterSearchQuery, setSearchQuery: setFilterSearchQuery, filterProducts } = useProductFiltering();
  
  // Apply filtering to products
  const filteredProducts = filterProducts(products || []);
  
  // Product reordering
  const { reorderProduct } = useProductReordering(products || [], loadProducts, categoryId);
  
  // Product CRUD operations
  const { addProduct, updateProduct, deleteProduct } = useProductCRUD(
    categoryId,
    loadProducts,
    selectProduct
  );
  
  // Start editing mode for a product
  const startEditingProduct = useCallback((productId?: string) => {
    if (productId) {
      selectProduct(productId);
    } else {
      selectProduct("");
    }
    setIsEditing(true);
  }, [selectProduct]);
  
  // Clear selection when category changes
  useEffect(() => {
    selectProduct("");
    setIsEditing(false);
    setSearchQuery("");
    setFilterSearchQuery("");
  }, [categoryId, selectProduct, setFilterSearchQuery]);

  // Sync local search query with the filtering hook's search query
  useEffect(() => {
    setFilterSearchQuery(searchQuery);
  }, [searchQuery, setFilterSearchQuery]);

  // Load products when category changes
  useEffect(() => {
    if (categoryId) {
      loadProducts(categoryId);
    }
  }, [categoryId, loadProducts]);

  return {
    filteredProducts,
    selectedProductId,
    isLoadingProducts,
    isEditing,
    searchQuery,
    setSearchQuery,
    selectProduct,
    startEditingProduct,
    setIsEditing,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderProduct
  };
};
