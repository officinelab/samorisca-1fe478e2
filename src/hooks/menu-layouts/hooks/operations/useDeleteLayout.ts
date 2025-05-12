
import { PrintLayout } from "@/types/printLayout";
import { saveLayouts } from "../../storage/layoutStorage";
import { toast } from "@/components/ui/sonner";

/**
 * Hook functionality for deleting a layout
 */
export const useDeleteLayout = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  activeLayout: PrintLayout | null,
  setActiveLayout: (layout: PrintLayout | null) => void,
  setError: (error: string | null) => void
) => {
  // Delete a layout
  const deleteLayout = async (layoutId: string): Promise<boolean> => {
    if (!layouts || !Array.isArray(layouts) || layouts.length <= 1) {
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

  return { deleteLayout };
};
