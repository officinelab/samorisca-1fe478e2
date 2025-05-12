
import { PrintLayout } from "@/types/printLayout";
import { saveLayouts } from "../../storage/layoutStorage";
import { cloneExistingLayout } from "../../utils/operations";
import { toast } from "@/components/ui/sonner";

/**
 * Hook functionality for cloning a layout
 */
export const useCloneLayout = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  setError: (error: string | null) => void
) => {
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

  return { cloneLayout };
};
