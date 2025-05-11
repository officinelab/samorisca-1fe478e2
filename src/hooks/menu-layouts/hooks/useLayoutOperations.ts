
import { PrintLayout } from "@/types/printLayout";
import { saveLayouts } from "../storage/layoutStorage";
import { 
  updateLayoutInList, 
  createNewLayoutFromTemplate,
  cloneExistingLayout,
  syncPageMargins
} from "../utils/operations";
import { toast } from "@/components/ui/sonner";

/**
 * Hook for layout operations (in combination with useLayoutStorage)
 */
export const useLayoutOperations = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  activeLayout: PrintLayout | null,
  setActiveLayout: (layout: PrintLayout | null) => void,
  setError: (error: string | null) => void
) => {
  // Add a new layout
  const addLayout = async (newLayout: Omit<PrintLayout, "id">): Promise<PrintLayout> => {
    const id = Date.now().toString();
    const layoutWithId = { ...newLayout, id } as PrintLayout;
    
    // If set as default, remove flag from others
    let updatedLayouts = [...layouts];
    if (newLayout.isDefault) {
      updatedLayouts = updatedLayouts.map(layout => ({
        ...layout,
        isDefault: false
      }));
    }
    
    const newLayouts = [...updatedLayouts, layoutWithId];
    const { success, error: saveError } = await saveLayouts(newLayouts);
    
    if (success) {
      setLayouts(newLayouts);
      
      if (newLayout.isDefault) {
        setActiveLayout(layoutWithId);
      }
      
      toast.success("Layout aggiunto con successo");
    } else {
      setError(saveError);
      toast.error(saveError || "Errore durante l'aggiunta del layout");
    }
    
    return layoutWithId;
  };

  // Update an existing layout
  const updateLayout = async (updatedLayout: PrintLayout) => {
    if (!layouts) {
      setError("Nessun layout disponibile per l'aggiornamento.");
      return;
    }
    
    const updatedLayouts = updateLayoutInList(layouts, updatedLayout);
    const { success, error: saveError } = await saveLayouts(updatedLayouts);
    
    if (success) {
      setLayouts(updatedLayouts);
      
      const finalLayout = syncPageMargins(updatedLayout);
      if (finalLayout.isDefault || (activeLayout && activeLayout.id === finalLayout.id)) {
        setActiveLayout(finalLayout);
      }
      
      toast.success("Layout aggiornato con successo");
    } else {
      setError(saveError);
      toast.error(saveError || "Errore durante l'aggiornamento del layout");
    }
  };

  // Delete a layout
  const deleteLayout = async (layoutId: string): Promise<boolean> => {
    if (!layouts || layouts.length <= 1) {
      setError("Non puoi eliminare l'unico layout disponibile.");
      toast.error("Non puoi eliminare l'unico layout disponibile");
      return false;
    }
    
    const layoutToDelete = layouts.find(layout => layout.id === layoutId);
    const updatedLayouts = layouts.filter(layout => layout.id !== layoutId);
    
    // If deleting default layout, set first as default
    if (layoutToDelete && layoutToDelete.isDefault && updatedLayouts.length > 0) {
      updatedLayouts[0].isDefault = true;
    }
    
    const { success, error: saveError } = await saveLayouts(updatedLayouts);
    
    if (success) {
      setLayouts(updatedLayouts);
      
      // If deleting active layout, set first as active
      if (activeLayout && activeLayout.id === layoutId) {
        const newActiveLayout = updatedLayouts.find(layout => layout.isDefault) || updatedLayouts[0];
        setActiveLayout(newActiveLayout);
      }
      
      toast.success("Layout eliminato con successo");
      return true;
    } else {
      setError(saveError);
      toast.error(saveError || "Errore durante l'eliminazione del layout");
      return false;
    }
  };

  // Set a layout as default
  const setDefaultLayout = async (layoutId: string) => {
    if (!layouts || !Array.isArray(layouts)) {
      setError("Nessun layout disponibile.");
      return;
    }
    
    const updatedLayouts = layouts.map(layout => ({
      ...layout,
      isDefault: layout.id === layoutId
    }));
    
    const { success, error: saveError } = await saveLayouts(updatedLayouts);
    
    if (success) {
      setLayouts(updatedLayouts);
      
      const newDefaultLayout = updatedLayouts.find(layout => layout.id === layoutId);
      if (newDefaultLayout) {
        setActiveLayout(newDefaultLayout);
      }
      
      toast.success("Layout impostato come predefinito");
    } else {
      setError(saveError);
      toast.error(saveError || "Errore durante l'impostazione del layout predefinito");
    }
  };

  // Clone an existing layout
  const cloneLayout = async (layoutId: string): Promise<PrintLayout | null> => {
    if (!layouts || !Array.isArray(layouts)) {
      setError("Nessun layout disponibile per la clonazione.");
      return null;
    }
    
    const clonedLayout = cloneExistingLayout(layoutId, layouts);
    
    if (!clonedLayout) {
      setError("Layout non trovato.");
      toast.error("Layout non trovato");
      return null;
    }
    
    const updatedLayouts = [...layouts, clonedLayout];
    const { success, error: saveError } = await saveLayouts(updatedLayouts);
    
    if (success) {
      setLayouts(updatedLayouts);
      toast.success("Layout clonato con successo");
      return clonedLayout;
    } else {
      setError(saveError);
      toast.error(saveError || "Errore durante la clonazione del layout");
      return null;
    }
  };

  // Create a new layout from scratch
  const createNewLayout = async (name: string): Promise<PrintLayout> => {
    if (!layouts) {
      setError("Impossibile creare un nuovo layout.");
      return createNewLayoutFromTemplate(name, []);
    }
    
    const newLayout = createNewLayoutFromTemplate(name, layouts);
    const updatedLayouts = [...layouts, newLayout];
    
    const { success, error: saveError } = await saveLayouts(updatedLayouts);
    
    if (success) {
      setLayouts(updatedLayouts);
      toast.success("Nuovo layout creato con successo");
    } else {
      setError(saveError);
      toast.error(saveError || "Errore durante la creazione del nuovo layout");
    }
    
    return newLayout;
  };

  return {
    addLayout,
    updateLayout,
    deleteLayout,
    setDefaultLayout,
    cloneLayout,
    createNewLayout
  };
};
