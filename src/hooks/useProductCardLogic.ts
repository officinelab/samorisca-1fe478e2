
import { useDynamicGoogleFont } from "@/hooks/useDynamicGoogleFont";
import { Product } from "@/types/database";

interface FontSettings {
  title?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic"; fontSize?: number };
  description?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic"; fontSize?: number };
  price?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic"; fontSize?: number };
}

export const useProductCardLogic = (product: Product, fontSettings?: FontSettings) => {
  const title = product.displayTitle || product.title;
  const description = product.displayDescription || product.description;
  const priceSuffix = product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : "";

  // Carica dinamicamente i font
  useDynamicGoogleFont(fontSettings?.title?.fontFamily);
  useDynamicGoogleFont(fontSettings?.price?.fontFamily);

  // Ordina allergeni per numero crescente
  const sortedAllergens = product.allergens 
    ? [...product.allergens].sort((a, b) => a.number - b.number)
    : [];

  // Ordina caratteristiche per display_order crescente
  const sortedFeatures = product.features 
    ? [...product.features].sort((a, b) => a.display_order - b.display_order)
    : [];

  return {
    title,
    description,
    priceSuffix,
    sortedAllergens,
    sortedFeatures
  };
};
