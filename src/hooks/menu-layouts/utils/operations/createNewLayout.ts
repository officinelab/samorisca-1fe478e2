
import { PrintLayout } from "@/types/printLayout";
import { defaultLayouts } from "../defaultLayouts";
import { ensureValidPageMargins } from "../../storage/layoutValidator";

/**
 * Creates a new layout from a template
 * Uses the classic layout as base for new layouts
 */
export const createNewLayoutFromTemplate = (
  name: string,
  layouts: PrintLayout[]
): PrintLayout => {
  // Use the classic layout as base for a new layout
  const baseLayout = defaultLayouts.find(layout => layout.type === "classic") || defaultLayouts[0];
  
  return ensureValidPageMargins({
    ...baseLayout,
    id: Date.now().toString(),
    name: name,
    type: "custom" as const,
    isDefault: false
  });
};
