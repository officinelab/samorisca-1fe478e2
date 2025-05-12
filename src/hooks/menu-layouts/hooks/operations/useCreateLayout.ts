
import { PrintLayout } from "@/types/printLayout";
import { saveLayouts } from "../../storage/layoutStorage";
import { createNewLayoutFromTemplate } from "../../utils/operations";
import { toast } from "@/components/ui/sonner";

/**
 * Hook functionality for creating a new layout
 */
export const useCreateLayout = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  setError: (error: string | null) => void
) => {
  // Create a new layout from scratch
  const createNewLayout = async (name: string): Promise<PrintLayout> => {
    if (!layouts || !Array.isArray(layouts)) {
      setError("Impossibile creare un nuovo layout.");
      return createNewLayoutFromTemplate(name);
    }
    
    const newLayout = createNewLayoutFromTemplate(name);
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

  return { createNewLayout };
};
