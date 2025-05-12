
import { PrintLayout } from "@/types/printLayout";
import { saveLayouts } from "../../storage/layoutStorage";
import { updateLayoutInList, syncPageMargins } from "../../utils/operations";
import { toast } from "@/components/ui/sonner";

/**
 * Hook functionality for updating an existing layout
 */
export const useUpdateLayout = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  activeLayout: PrintLayout | null,
  setActiveLayout: (layout: PrintLayout | null) => void,
  setError: (error: string | null) => void
) => {
  // Update an existing layout
  const updateLayout = async (updatedLayout: PrintLayout) => {
    if (!layouts || !Array.isArray(layouts)) {
      setError("Nessun layout disponibile per l'aggiornamento.");
      return;
    }
    
    console.log("useUpdateLayout - Updating layout:", updatedLayout);
    
    // Ensure page margins are synchronized
    const finalLayout = syncPageMargins(updatedLayout);
    
    const updatedLayouts = updateLayoutInList(layouts, finalLayout);
    const { success, error: saveError } = await saveLayouts(updatedLayouts);
    
    if (success) {
      setLayouts(updatedLayouts);
      
      if (finalLayout.isDefault || (activeLayout && activeLayout.id === finalLayout.id)) {
        console.log("useUpdateLayout - Setting active layout to updated layout:", finalLayout);
        setActiveLayout(finalLayout);
      }
      
      toast.success("Layout aggiornato con successo");
    } else {
      setError(saveError);
      toast.error(saveError || "Errore durante l'aggiornamento del layout");
    }
  };

  return { updateLayout };
};
