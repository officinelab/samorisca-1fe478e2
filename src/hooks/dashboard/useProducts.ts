
import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types/database";
import { useProductLoader } from "./product-actions/useProductLoader";
import { useProductSelection } from "./product-actions/useProductSelection";
import { useProductFiltering } from "./product-actions/useProductFiltering";
import { useProductCRUD } from "./product-actions/useProductCRUD";
import { useProductReordering } from "./product-actions/useProductReordering";

export const useProducts = (categoryId: string | null) => {
  const { 
    products, 
    setProducts,
    isLoadingProducts, 
    loadProducts 
  } = useProductLoader();
  
  const {
    selectedProductId,
    isEditing,
    setIsEditing,
    selectProduct,
    startEditingProduct
  } = useProductSelection();
  
  const {
    searchQuery,
    setSearchQuery,
    filterProducts
  } = useProductFiltering();
  
  const {
    addProduct,
    updateProduct,
    deleteProduct
  } = useProductCRUD(categoryId, loadProducts, selectProduct);
  
  const { reorderProduct: reorderProductBase } = useProductReordering(products, loadProducts, categoryId);

  // Adapter for reorderProduct to update local state
  const reorderProduct = useCallback(async (productId: string, direction: 'up' | 'down') => {
    const updatedProducts = await reorderProductBase(productId, direction);
    if (updatedProducts) {
      setProducts(updatedProducts);
      return true;
    }
    return false;
  }, [reorderProductBase, setProducts]);

  // Load products when categoryId changes
  useEffect(() => {
    if (categoryId) {
      loadProducts(categoryId);
    }
    // Reset selection when category changes
    setIsEditing(false);
  }, [categoryId, loadProducts]);

  // Get filtered products
  const filteredProducts = filterProducts(products);

  return {
    products,
    filteredProducts,
    selectedProductId,
    isLoadingProducts,
    isEditing,
    searchQuery,
    setSearchQuery,
    selectProduct,
    startEditingProduct,
    setIsEditing,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderProduct
  };
};
