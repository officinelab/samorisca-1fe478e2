
import { useState, useCallback } from "react";
import { PrintLayout } from "@/types/printLayout";
import { saveLayouts } from "../../storage/layoutSaver";
import { toast } from "@/components/ui/sonner";
import { deleteLayoutFromSupabase } from "../../services/supabaseLayoutService";

export const useDeleteLayout = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  activeLayout: PrintLayout | null,
  setActiveLayout: (layout: PrintLayout | null) => void,
  setError: (error: string | null) => void
) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteLayout = useCallback(
    async (layoutId: string) => {
      if (layouts.length <= 1) {
        toast.error("Non è possibile eliminare l'ultimo layout rimanente");
        return false;
      }

      setIsDeleting(true);
      try {
        // Elimina il layout da Supabase
        const { success, error } = await deleteLayoutFromSupabase(layoutId);

        if (!success) {
          toast.error(error || "Errore durante l'eliminazione del layout");
          setError(error || "Errore durante l'eliminazione del layout");
          return false;
        }

        // Aggiorna lo stato locale
        const newLayouts = layouts.filter((l) => l.id !== layoutId);
        setLayouts(newLayouts);

        // Se il layout attivo è stato eliminato, seleziona un altro layout
        if (activeLayout && activeLayout.id === layoutId) {
          const newActiveLayout = newLayouts.find((l) => l.isDefault) || newLayouts[0];
          setActiveLayout(newActiveLayout);
        }

        return true;
      } catch (err) {
        console.error("Errore durante l'eliminazione del layout:", err);
        toast.error("Errore durante l'eliminazione del layout");
        setError("Errore durante l'eliminazione del layout");
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [layouts, activeLayout, setLayouts, setActiveLayout, setError]
  );

  return {
    deleteLayout,
    isDeleting
  };
};
