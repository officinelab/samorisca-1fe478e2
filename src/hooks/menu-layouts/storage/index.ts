
import { LAYOUTS_STORAGE_KEY } from "../constants";
import { PrintLayout } from "@/types/printLayout";
import { defaultLayouts } from "../utils/defaultLayouts";

/**
 * Load layouts from localStorage or use default layouts if none exist
 */
export const loadLayouts = (): PrintLayout[] => {
  try {
    const storedLayouts = localStorage.getItem(LAYOUTS_STORAGE_KEY);
    if (storedLayouts) {
      const parsedLayouts = JSON.parse(storedLayouts);
      if (Array.isArray(parsedLayouts) && parsedLayouts.length > 0) {
        return parsedLayouts;
      }
    }
    
    // If no layouts in storage or invalid, return default layouts
    return defaultLayouts;
  } catch (error) {
    console.error("Error loading layouts:", error);
    return defaultLayouts;
  }
};

/**
 * Save layouts to localStorage
 */
export const saveLayouts = (layouts: PrintLayout[]): void => {
  try {
    localStorage.setItem(LAYOUTS_STORAGE_KEY, JSON.stringify(layouts));
  } catch (error) {
    console.error("Error saving layouts:", error);
  }
};
