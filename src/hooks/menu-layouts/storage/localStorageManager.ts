
import { LAYOUTS_STORAGE_KEY } from "../constants";

/**
 * Generic function to get data from localStorage
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
 */
export const getLayoutsFromStorage = () => {
  return getFromStorage(LAYOUTS_STORAGE_KEY);
};

/**
 * Save layouts to localStorage
 */
export const saveLayoutsToStorage = (layouts: any) => {
  return saveToStorage(LAYOUTS_STORAGE_KEY, layouts);
};
