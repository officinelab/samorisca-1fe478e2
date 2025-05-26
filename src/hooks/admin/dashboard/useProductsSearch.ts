
import { useState, useMemo } from "react";
import { Product } from "@/types/database";

export const useProductsSearch = (products: Product[], isReordering: boolean) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter(
      product => product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const clearSearch = () => setSearchQuery("");

  return {
    searchQuery,
    setSearchQuery,
    filteredProducts,
    clearSearch,
    isSearchDisabled: isReordering
  };
};
