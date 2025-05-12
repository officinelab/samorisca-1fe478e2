
import { useState, useCallback } from "react";
import { PrintLayout } from "@/types/printLayout";
import { createNewLayoutFromTemplate } from "../../utils/layoutOperations";
import { toast } from "@/components/ui/sonner";
import { v4 as uuidv4 } from "uuid";
import { saveLayoutToSupabase } from "../../services/supabaseLayoutService";

export const useCreateLayout = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  setError: (error: string | null) => void
) => {
  const [isCreating, setIsCreating] = useState(false);

  const createNewLayout = useCallback(
    async (name: string) => {
      if (layouts.length >= 4) {
        toast.error("Non è possibile creare più di 4 layout");
        setError("Non è possibile creare più di 4 layout");
        return null;
      }

      setIsCreating(true);
      try {
        // Crea il nuovo layout
        const newLayout = createNewLayoutFromTemplate(name);
        
        // Assegna un ID univoco
        const layoutWithId = {
          ...newLayout,
          id: uuidv4()
        };
        
        // Salva il layout su Supabase
        const { success, error, layout } = await saveLayoutToSupabase(layoutWithId);

        if (!success || !layout) {
          toast.error(error || "Errore durante la creazione del layout");
          setError(error || "Errore durante la creazione del layout");
          return null;
        }

        // Aggiorna lo stato locale
        setLayouts([...layouts, layout]);

        return layout;
      } catch (err) {
        console.error("Errore durante la creazione del layout:", err);
        toast.error("Errore durante la creazione del layout");
        setError("Errore durante la creazione del layout");
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [layouts, setLayouts, setError]
  );

  return {
    createNewLayout,
    isCreating
  };
};
