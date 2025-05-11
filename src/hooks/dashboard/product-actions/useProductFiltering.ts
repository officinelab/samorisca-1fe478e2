
import { useState, useCallback } from "react";
import { Product } from "@/types/database";

export const useProductFiltering = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on search query
  const filterProducts = useCallback((products: Product[]): Product[] => {
    if (!products || !Array.isArray(products)) {
      return [];
    }
    
    if (!searchQuery.trim()) {
      return products;
    }
    
    return products.filter(
      product => product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filterProducts
  };
};
