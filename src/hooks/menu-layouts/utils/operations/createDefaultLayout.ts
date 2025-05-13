
import { v4 as uuidv4 } from "uuid";
import { PrintLayout } from "@/types/printLayout";
import { defaultLayouts } from "../../utils/defaultLayouts";

/**
 * Crea un nuovo layout predefinito
 */
export const createDefaultLayout = (layoutType: string = "classic"): PrintLayout => {
  // Cerca un layout predefinito del tipo specificato
  const baseLayout = defaultLayouts.find(layout => layout.type === layoutType) || defaultLayouts[0];
  
  // Clone the layout and generate a new ID
  return {
    ...baseLayout,
    id: uuidv4(),
    name: `Nuovo Layout (${new Date().toLocaleDateString()})`,
    isDefault: false
  };
};
