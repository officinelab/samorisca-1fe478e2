
import { LAYOUTS_STORAGE_KEY } from "../constants";

/**
 * Generic function to get data from localStorage
 * @deprecated Use supabaseLayoutService instead
 */
export const getFromStorage = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error(`Error getting data from localStorage (key: ${key}):`, err);
    return null;
  }
};

/**
 * Generic function to set data in localStorage
 * @deprecated Use supabaseLayoutService instead
 */
export const saveToStorage = <T>(key: string, data: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error(`Error saving data to localStorage (key: ${key}):`, err);
    return false;
  }
};

/**
 * Get layouts from localStorage
 * @deprecated Use fetchLayoutsFromSupabase instead
 */
export const getLayoutsFromStorage = () => {
  return getFromStorage(LAYOUTS_STORAGE_KEY);
};

/**
 * Save layouts to localStorage
 * @deprecated Use saveLayoutToSupabase instead
 */
export const saveLayoutsToStorage = (layouts: any) => {
  console.warn("saveLayoutsToStorage è deprecato. Usa saveLayoutToSupabase invece.");
  return saveToStorage(LAYOUTS_STORAGE_KEY, layouts);
};
