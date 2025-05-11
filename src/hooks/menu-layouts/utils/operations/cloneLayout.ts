
import { PrintLayout } from "@/types/printLayout";
import { ensureValidPageMargins } from "../../storage/layoutValidator";

/**
 * Clones an existing layout
 * Returns null if the layout to clone is not found
 */
export const cloneExistingLayout = (
  layoutId: string,
  layouts: PrintLayout[]
): PrintLayout | null => {
  const layoutToClone = layouts.find(layout => layout.id === layoutId);
  
  if (!layoutToClone) {
    return null;
  }
  
  return ensureValidPageMargins({
    ...layoutToClone,
    id: Date.now().toString(),
    name: `${layoutToClone.name} (copia)`,
    isDefault: false
  });
};
