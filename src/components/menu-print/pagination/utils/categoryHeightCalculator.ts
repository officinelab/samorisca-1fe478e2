
import { Category } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";
import { MM_TO_PX } from "./constants";

/**
 * Stima l'altezza di un titolo categoria basandosi sul layout e DOM reale.
 */
export const estimateCategoryTitleHeight = (
  category: Category,
  language: string,
  customLayout: PrintLayout | null | undefined,
  pageIndex: number
): number => {
  if (!customLayout?.elements?.category) {
    // Fallback: stima basata su font size standard
    return 60 * MM_TO_PX; // ~60mm di default
  }

  const categoryConfig = customLayout.elements.category;
  const spacing = customLayout.spacing;
  
  // Calcola l'altezza basata su:
  // 1. Font size
  // 2. Line height (assumiamo 1.5x del font size)
  // 3. Margini
  // 4. Spacing sotto il titolo categoria
  
  const fontSize = categoryConfig.fontSize || 16;
  const lineHeight = fontSize * 1.5;
  const margins = categoryConfig.margin;
  
  // Altezza totale in pixel
  let totalHeight = lineHeight; // Altezza del testo
  totalHeight += (margins.top + margins.bottom) * MM_TO_PX; // Margini in mm convertiti in px
  totalHeight += (spacing?.categoryTitleBottomMargin || 10) * MM_TO_PX; // Spacing sotto categoria
  
  return totalHeight;
};
