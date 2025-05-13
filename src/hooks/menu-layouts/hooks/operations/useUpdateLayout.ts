
import { useState } from "react";
import { PrintLayout } from "@/types/printLayout";
import { saveLayouts } from "../../storage";

export const useUpdateLayout = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  activeLayout: PrintLayout | null,
  setActiveLayout: (layout: PrintLayout | null) => void,
  setError: (error: string | null) => void
) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateLayout = async (updatedLayout: PrintLayout): Promise<PrintLayout> => {
    try {
      setIsUpdating(true);
      
      // Trova l'indice del layout da aggiornare
      const layoutIndex = layouts.findIndex(l => l.id === updatedLayout.id);
      
      if (layoutIndex === -1) {
        throw new Error(`Layout con ID ${updatedLayout.id} non trovato`);
      }
      
      // Crea una nuova lista con il layout aggiornato
      const updatedLayouts = [...layouts];
      updatedLayouts[layoutIndex] = updatedLayout;
      
      // Aggiorna lo stato locale
      setLayouts(updatedLayouts);
      
      // Se il layout attivo è stato aggiornato, aggiorna anche activeLayout
      if (activeLayout && activeLayout.id === updatedLayout.id) {
        setActiveLayout(updatedLayout);
      }
      
      // Salva i layout aggiornati
      const { success, error } = await saveLayouts(updatedLayouts);
      if (!success) {
        setError(error || "Errore durante l'aggiornamento del layout");
        throw new Error(error || "Errore durante l'aggiornamento del layout");
      }
      
      return updatedLayout;
    } catch (err) {
      console.error("Errore durante l'aggiornamento del layout:", err);
      setError(`Errore durante l'aggiornamento del layout: ${err}`);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateLayout, isUpdating };
};
