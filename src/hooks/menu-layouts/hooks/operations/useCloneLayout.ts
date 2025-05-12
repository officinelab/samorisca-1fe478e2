
import { useState, useCallback } from "react";
import { PrintLayout } from "@/types/printLayout";
import { cloneExistingLayout } from "../../utils/layoutOperations";
import { toast } from "@/components/ui/sonner";
import { v4 as uuidv4 } from "uuid";
import { saveLayoutToSupabase } from "../../services/supabaseLayoutService";

export const useCloneLayout = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  setError: (error: string | null) => void
) => {
  const [isCloning, setIsCloning] = useState(false);

  const cloneLayout = useCallback(
    async (layoutId: string) => {
      if (layouts.length >= 4) {
        toast.error("Non è possibile creare più di 4 layout");
        setError("Non è possibile creare più di 4 layout");
        return null;
      }

      setIsCloning(true);
      try {
        // Trova il layout da clonare
        const layoutToClone = layouts.find((l) => l.id === layoutId);
        if (!layoutToClone) {
          toast.error("Layout non trovato");
          setError("Layout non trovato");
          return null;
        }

        // Clona il layout
        const clonedLayout = cloneExistingLayout(layoutToClone);
        
        // Assegna un ID univoco
        const layoutWithId = {
          ...clonedLayout,
          id: uuidv4()
        };
        
        // Salva il layout clonato su Supabase
        const { success, error, layout } = await saveLayoutToSupabase(layoutWithId);

        if (!success || !layout) {
          toast.error(error || "Errore durante la clonazione del layout");
          setError(error || "Errore durante la clonazione del layout");
          return null;
        }

        // Aggiorna lo stato locale
        setLayouts([...layouts, layout]);

        return layout;
      } catch (err) {
        console.error("Errore durante la clonazione del layout:", err);
        toast.error("Errore durante la clonazione del layout");
        setError("Errore durante la clonazione del layout");
        return null;
      } finally {
        setIsCloning(false);
      }
    },
    [layouts, setLayouts, setError]
  );

  return {
    cloneLayout,
    isCloning
  };
};
