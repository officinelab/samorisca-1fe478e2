
import { useState } from "react";
import { PrintLayout } from "@/types/printLayout";
import { generateId } from "../../utils/operations/idGenerator";
import { saveLayouts } from "../../storage";

export const useCloneLayout = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  setError: (error: string | null) => void
) => {
  const [isCloning, setIsCloning] = useState(false);

  const cloneLayout = async (layoutId: string): Promise<PrintLayout | null> => {
    try {
      setIsCloning(true);
      
      // Trova il layout da clonare
      const layoutToClone = layouts.find(l => l.id === layoutId);
      if (!layoutToClone) {
        setError(`Layout con ID ${layoutId} non trovato`);
        return null;
      }
      
      // Crea un clone del layout con un nuovo ID
      const clonedLayout: PrintLayout = {
        ...JSON.parse(JSON.stringify(layoutToClone)), // Deep clone
        id: generateId(),
        name: `${layoutToClone.name} (Copia)`,
        isDefault: false
      };
      
      // Aggiorna la lista dei layout
      const updatedLayouts = [...layouts, clonedLayout];
      setLayouts(updatedLayouts);
      
      // Salva i layout aggiornati
      const { success, error } = await saveLayouts(updatedLayouts);
      if (!success) {
        setError(error || "Errore durante la clonazione del layout");
        return null;
      }
      
      return clonedLayout;
    } catch (err) {
      console.error("Errore durante la clonazione del layout:", err);
      setError(`Errore durante la clonazione del layout: ${err}`);
      return null;
    } finally {
      setIsCloning(false);
    }
  };

  return { cloneLayout, isCloning };
};
