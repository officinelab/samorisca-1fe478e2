
import { useState } from "react";
import { PrintLayout } from "@/types/printLayout";
import { saveLayouts } from "../../storage";

export const useDeleteLayout = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  activeLayout: PrintLayout | null,
  setActiveLayout: (layout: PrintLayout | null) => void,
  setError: (error: string | null) => void
) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteLayout = async (layoutId: string): Promise<boolean> => {
    try {
      // Non permettere di eliminare l'unico layout rimasto
      if (layouts.length <= 1) {
        setError("Non è possibile eliminare l'unico layout rimanente");
        return false;
      }
      
      setIsDeleting(true);
      
      // Trova il layout da eliminare
      const layoutToDelete = layouts.find(l => l.id === layoutId);
      if (!layoutToDelete) {
        setError(`Layout con ID ${layoutId} non trovato`);
        return false;
      }
      
      // Rimuovi il layout dalla lista
      const updatedLayouts = layouts.filter(l => l.id !== layoutId);
      setLayouts(updatedLayouts);
      
      // Se il layout attivo è stato eliminato, imposta un altro layout come attivo
      if (activeLayout && activeLayout.id === layoutId) {
        const newActiveLayout = updatedLayouts.find(l => l.isDefault) || updatedLayouts[0];
        setActiveLayout(newActiveLayout || null);
      }
      
      // Salva i layout aggiornati
      const { success, error } = await saveLayouts(updatedLayouts);
      if (!success) {
        setError(error || "Errore durante l'eliminazione del layout");
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Errore durante l'eliminazione del layout:", err);
      setError(`Errore durante l'eliminazione del layout: ${err}`);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteLayout, isDeleting };
};
