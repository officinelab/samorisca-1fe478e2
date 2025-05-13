
import { useState } from "react";
import { PrintLayout } from "@/types/printLayout";
import { generateId } from "../../utils/operations/idGenerator";
import { saveLayouts } from "../../storage";

export const useAddLayout = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  setActiveLayout: (layout: PrintLayout | null) => void,
  setError: (error: string | null) => void
) => {
  const [isAdding, setIsAdding] = useState(false);

  const addLayout = async (newLayoutData: Omit<PrintLayout, "id">): Promise<PrintLayout> => {
    try {
      setIsAdding(true);
      
      // Crea un nuovo layout con id generato
      const newLayout: PrintLayout = {
        ...newLayoutData,
        id: generateId()
      };
      
      // Aggiorna la lista dei layout
      const updatedLayouts = [...layouts, newLayout];
      setLayouts(updatedLayouts);
      
      // Imposta il nuovo layout come attivo
      setActiveLayout(newLayout);
      
      // Salva i layout aggiornati
      const { success, error } = await saveLayouts(updatedLayouts);
      if (!success) {
        setError(error || "Errore durante il salvataggio del layout");
        throw new Error(error || "Errore durante il salvataggio del layout");
      }
      
      return newLayout;
    } catch (err) {
      console.error("Errore durante l'aggiunta del layout:", err);
      setError(`Errore durante l'aggiunta del layout: ${err}`);
      throw err;
    } finally {
      setIsAdding(false);
    }
  };

  return { addLayout, isAdding };
};
