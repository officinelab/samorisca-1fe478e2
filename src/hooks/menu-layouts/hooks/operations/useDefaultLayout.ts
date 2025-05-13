
import { useState } from "react";
import { PrintLayout } from "@/types/printLayout";
import { saveLayouts } from "../../storage";

export const useDefaultLayout = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  setActiveLayout: (layout: PrintLayout | null) => void,
  setError: (error: string | null) => void
) => {
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  const setDefaultLayout = async (layoutId: string): Promise<boolean> => {
    try {
      setIsSettingDefault(true);
      
      // Trova il layout da impostare come predefinito
      const layoutToSetDefault = layouts.find(l => l.id === layoutId);
      if (!layoutToSetDefault) {
        setError(`Layout con ID ${layoutId} non trovato`);
        return false;
      }
      
      // Crea una nuova lista con il layout aggiornato come predefinito
      const updatedLayouts = layouts.map(layout => ({
        ...layout,
        isDefault: layout.id === layoutId
      }));
      
      // Aggiorna lo stato locale
      setLayouts(updatedLayouts);
      
      // Imposta il layout come attivo
      setActiveLayout(layoutToSetDefault);
      
      // Salva i layout aggiornati
      const { success, error } = await saveLayouts(updatedLayouts);
      if (!success) {
        setError(error || "Errore durante l'impostazione del layout predefinito");
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Errore durante l'impostazione del layout predefinito:", err);
      setError(`Errore durante l'impostazione del layout predefinito: ${err}`);
      return false;
    } finally {
      setIsSettingDefault(false);
    }
  };

  return { setDefaultLayout, isSettingDefault };
};
