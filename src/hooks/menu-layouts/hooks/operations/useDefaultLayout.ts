
import { useState, useCallback } from "react";
import { PrintLayout } from "@/types/printLayout";
import { toast } from "@/components/ui/sonner";
import { setLayoutAsDefault } from "../../services/supabaseLayoutService";

export const useDefaultLayout = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  setActiveLayout: (layout: PrintLayout | null) => void,
  setError: (error: string | null) => void
) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const setDefaultLayout = useCallback(
    async (layoutId: string) => {
      setIsProcessing(true);
      try {
        // Imposta il layout come predefinito su Supabase
        const { success, error } = await setLayoutAsDefault(layoutId);

        if (!success) {
          toast.error(error || "Errore nell'impostazione del layout predefinito");
          setError(error || "Errore nell'impostazione del layout predefinito");
          return false;
        }

        // Aggiorna lo stato locale
        const newLayouts = layouts.map((layout) => ({
          ...layout,
          isDefault: layout.id === layoutId
        }));

        setLayouts(newLayouts);
        
        // Imposta il layout predefinito come attivo
        const defaultLayout = newLayouts.find((l) => l.id === layoutId) || null;
        if (defaultLayout) {
          setActiveLayout(defaultLayout);
        }

        return true;
      } catch (err) {
        console.error("Errore nell'impostazione del layout predefinito:", err);
        toast.error("Errore nell'impostazione del layout predefinito");
        setError("Errore nell'impostazione del layout predefinito");
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [layouts, setLayouts, setActiveLayout, setError]
  );

  return {
    setDefaultLayout,
    isProcessing
  };
};
