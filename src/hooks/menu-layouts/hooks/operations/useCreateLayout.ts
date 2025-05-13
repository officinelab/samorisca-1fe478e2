
import { useState } from "react";
import { PrintLayout } from "@/types/printLayout";
import { createDefaultLayout } from "../../utils/operations/createDefaultLayout";
import { saveLayouts } from "../../storage";

export const useCreateLayout = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  setError: (error: string | null) => void
) => {
  const [isCreating, setIsCreating] = useState(false);

  const createNewLayout = async (name: string): Promise<PrintLayout | null> => {
    try {
      setIsCreating(true);
      
      // Crea un nuovo layout basato sul layout predefinito
      const newLayout = createDefaultLayout();
      
      // Aggiorna il nome del layout
      newLayout.name = name || `Nuovo Layout`;
      
      // Aggiorna la lista dei layout
      const updatedLayouts = [...layouts, newLayout];
      setLayouts(updatedLayouts);
      
      // Salva i layout aggiornati
      const { success, error } = await saveLayouts(updatedLayouts);
      if (!success) {
        setError(error || "Errore durante la creazione del nuovo layout");
        return null;
      }
      
      return newLayout;
    } catch (err) {
      console.error("Errore durante la creazione del nuovo layout:", err);
      setError(`Errore durante la creazione del nuovo layout: ${err}`);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return { createNewLayout, isCreating };
};
