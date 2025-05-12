
import { useState, useCallback } from "react";
import { PrintLayout } from "@/types/printLayout";
import { updateLayoutInList } from "../../utils/layoutOperations";
import { toast } from "@/components/ui/sonner";
import { saveLayoutToSupabase } from "../../services/supabaseLayoutService";

export const useUpdateLayout = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  activeLayout: PrintLayout | null,
  setActiveLayout: (layout: PrintLayout | null) => void,
  setError: (error: string | null) => void
) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateLayout = useCallback(
    async (updatedLayout: PrintLayout) => {
      setIsUpdating(true);
      try {
        // Salva il layout aggiornato su Supabase
        const { success, error, layout } = await saveLayoutToSupabase(updatedLayout);

        if (!success) {
          toast.error(error || "Errore durante l'aggiornamento del layout");
          setError(error || "Errore durante l'aggiornamento del layout");
          return false;
        }

        // Aggiorna lo stato locale
        const finalLayout = layout || updatedLayout; // Usa il layout restituito da Supabase se disponibile
        const newLayouts = updateLayoutInList(layouts, finalLayout);
        setLayouts(newLayouts);

        // Aggiorna il layout attivo se necessario
        if (activeLayout && activeLayout.id === finalLayout.id) {
          setActiveLayout(finalLayout);
        }

        return finalLayout;
      } catch (err) {
        console.error("Errore durante l'aggiornamento del layout:", err);
        toast.error("Errore durante l'aggiornamento del layout");
        setError("Errore durante l'aggiornamento del layout");
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [layouts, activeLayout, setLayouts, setActiveLayout, setError]
  );

  return {
    updateLayout,
    isUpdating
  };
};
