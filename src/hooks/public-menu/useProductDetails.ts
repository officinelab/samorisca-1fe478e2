
import { useState } from "react";
import { Product } from "@/types/database";

export const useProductDetails = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Function to truncate text
  const truncateText = (text: string | null, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };
  
  return {
    selectedProduct,
    setSelectedProduct,
    truncateText
  };
};
