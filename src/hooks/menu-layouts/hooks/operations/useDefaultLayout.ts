
import { PrintLayout } from "@/types/printLayout";
import { saveLayouts } from "../../storage/layoutStorage";
import { toast } from "@/components/ui/sonner";

/**
 * Hook functionality for setting a layout as default
 */
export const useDefaultLayout = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  setActiveLayout: (layout: PrintLayout | null) => void,
  setError: (error: string | null) => void
) => {
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

  return { setDefaultLayout };
};
