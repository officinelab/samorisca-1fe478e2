
import { PrintLayout } from "@/types/printLayout";
import { saveLayouts } from "../../storage/layoutStorage";
import { toast } from "@/components/ui/sonner";

/**
 * Hook functionality for adding a new layout
 */
export const useAddLayout = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
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

  return { addLayout };
};
