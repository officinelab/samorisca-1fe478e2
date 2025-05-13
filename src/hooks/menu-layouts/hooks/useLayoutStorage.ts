
import { PrintLayout } from '@/types/printLayout';
import { loadLayouts, saveLayouts } from '../storage';
import { toast } from '@/components/ui/sonner';

/**
 * Custom hook for managing layout storage operations
 */
export const useLayoutStorage = () => {
  /**
   * Loads layouts from storage
   */
  const loadStoredLayouts = async (): Promise<PrintLayout[]> => {
    try {
      const result = await loadLayouts();
      return result.layouts || [];
    } catch (error) {
      console.error('Error loading layouts from storage:', error);
      toast.error('Errore durante il caricamento dei layout');
      return [];
    }
  };

  /**
   * Saves layouts to storage
   */
  const saveLayoutsToStorage = async (layouts: PrintLayout[]): Promise<void> => {
    try {
      await saveLayouts(layouts);
    } catch (error) {
      console.error('Error saving layouts to storage:', error);
      toast.error('Errore durante il salvataggio dei layout');
    }
  };

  return {
    loadStoredLayouts,
    saveLayoutsToStorage
  };
};
