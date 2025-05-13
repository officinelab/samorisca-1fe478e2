
import { PrintLayout } from '@/types/printLayout';
import { toast } from '@/components/ui/sonner';
import { updateLayoutInList } from '../utils/operations/updateLayoutInList';
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom hook for managing layout operations
 */
export const useLayoutOperations = (
  layouts: PrintLayout[],
  setLayouts: React.Dispatch<React.SetStateAction<PrintLayout[]>>,
  saveLayoutsToStorage: (layouts: PrintLayout[]) => Promise<void>
) => {
  /**
   * Creates a new layout
   */
  const createLayout = async (layoutData: Partial<PrintLayout>) => {
    try {
      // Create a new layout with ID
      const newLayout: PrintLayout = {
        ...(layoutData as any), // Casting to any to avoid type issues
        id: uuidv4(),
        isDefault: layoutData.isDefault || false
      };

      // Handle setting as default if needed
      let updatedLayouts = [...layouts];
      
      if (newLayout.isDefault) {
        updatedLayouts = layouts.map(layout => ({
          ...layout,
          isDefault: false
        }));
      }
      
      // Add the new layout
      updatedLayouts = [...updatedLayouts, newLayout];
      
      setLayouts(updatedLayouts);
      await saveLayoutsToStorage(updatedLayouts);
      
      return newLayout;
    } catch (error) {
      console.error('Error creating layout:', error);
      toast.error('Errore durante la creazione del layout');
      return null;
    }
  };

  /**
   * Updates an existing layout
   */
  const updateLayout = async (layoutId: string, updates: Partial<PrintLayout>) => {
    try {
      const updatedLayouts = updateLayoutInList(layouts, layoutId, updates);
      setLayouts(updatedLayouts);
      await saveLayoutsToStorage(updatedLayouts);
      
      const updatedLayout = updatedLayouts.find(layout => layout.id === layoutId);
      return updatedLayout || null;
    } catch (error) {
      console.error('Error updating layout:', error);
      toast.error('Errore durante l\'aggiornamento del layout');
      return null;
    }
  };

  /**
   * Deletes a layout
   */
  const deleteLayout = async (layoutId: string) => {
    try {
      const layoutToDelete = layouts.find(layout => layout.id === layoutId);
      
      if (!layoutToDelete) {
        throw new Error('Layout non trovato');
      }

      // Check if this is the default layout
      if (layoutToDelete.isDefault && layouts.length > 1) {
        // Find another layout to set as default
        const newDefault = layouts.find(layout => layout.id !== layoutId);
        if (newDefault) {
          newDefault.isDefault = true;
        }
      }

      // Filter out the layout to delete
      const updatedLayouts = layouts.filter(layout => layout.id !== layoutId);
      
      setLayouts(updatedLayouts);
      await saveLayoutsToStorage(updatedLayouts);
      
      return true;
    } catch (error) {
      console.error('Error deleting layout:', error);
      toast.error('Errore durante l\'eliminazione del layout');
      return false;
    }
  };

  /**
   * Sets a layout as the default
   */
  const setDefaultLayout = async (layoutId: string) => {
    try {
      // Find the layout to set as default
      const layoutToSetAsDefault = layouts.find(layout => layout.id === layoutId);
      
      if (!layoutToSetAsDefault) {
        throw new Error('Layout non trovato');
      }

      // Update all layouts
      const updatedLayouts = layouts.map(layout => ({
        ...layout,
        isDefault: layout.id === layoutId
      }));
      
      setLayouts(updatedLayouts);
      await saveLayoutsToStorage(updatedLayouts);
      
      return true;
    } catch (error) {
      console.error('Error setting default layout:', error);
      toast.error('Errore durante l\'impostazione del layout predefinito');
      return false;
    }
  };

  return {
    createLayout,
    updateLayout,
    deleteLayout,
    setDefaultLayout
  };
};
