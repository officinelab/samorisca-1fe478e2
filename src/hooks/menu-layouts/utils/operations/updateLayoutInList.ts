
import { PrintLayout } from "@/types/printLayout";
import { syncPageMargins } from "./syncPageMargins";

/**
 * Updates a layout in the layouts list
 * If the updated layout is set as default, removes the flag from other layouts
 */
export const updateLayoutInList = (
  layouts: PrintLayout[],
  updatedLayout: PrintLayout
): PrintLayout[] => {
  const finalLayout = syncPageMargins(updatedLayout);
  
  return layouts.map(layout => {
    if (layout.id === finalLayout.id) {
      return finalLayout;
    }
    
    // If the updated layout is set as default, remove the flag from others
    if (finalLayout.isDefault && layout.isDefault) {
      return { ...layout, isDefault: false };
    }
    
    return layout;
  });
};
