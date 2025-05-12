
import { PrintLayout } from "@/types/printLayout";
import { ensureValidPageMargins } from "../../storage/layoutValidator";

/**
 * Clones an existing layout
 * Returns null if the layout to clone is not found
 */
export const cloneExistingLayout = (
  layoutToClone: PrintLayout
): PrintLayout => {
  if (!layoutToClone) {
    throw new Error("Layout non trovato");
  }
  
  return ensureValidPageMargins({
    ...layoutToClone,
    id: Date.now().toString(),
    name: `${layoutToClone.name} (copia)`,
    isDefault: false
  });
};
