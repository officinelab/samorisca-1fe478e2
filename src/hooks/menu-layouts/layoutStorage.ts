
import { PrintLayout } from "@/types/printLayout";
import { defaultLayouts } from "./defaultLayouts";
import { LAYOUTS_STORAGE_KEY } from "./constants";

// Carica i layout salvati dal localStorage o quelli predefiniti
export const loadLayouts = async (): Promise<{ 
  layouts: PrintLayout[]; 
  defaultLayout: PrintLayout | null;
  error: string | null;
}> => {
  try {
    const savedLayouts = localStorage.getItem(LAYOUTS_STORAGE_KEY);
    
    if (savedLayouts) {
      const parsedLayouts = JSON.parse(savedLayouts) as PrintLayout[];
      
      // Assicurati che abbiamo un array valido
      if (!Array.isArray(parsedLayouts) || parsedLayouts.length === 0) {
        throw new Error("Struttura dati layout non valida");
      }
      
      const defaultLayout = parsedLayouts.find((layout) => layout.isDefault) || parsedLayouts[0];
      
      return {
        layouts: parsedLayouts,
        defaultLayout,
        error: null
      };
    } else {
      // Se non ci sono layout salvati, usa quelli predefiniti
      const defaultLayout = defaultLayouts.find(layout => layout.isDefault) || defaultLayouts[0];
      
      // Salva i layout predefiniti nel localStorage per il futuro
      localStorage.setItem(LAYOUTS_STORAGE_KEY, JSON.stringify(defaultLayouts));
      
      return {
        layouts: defaultLayouts,
        defaultLayout,
        error: null
      };
    }
  } catch (err) {
    console.error("Errore durante il caricamento dei layout:", err);
    
    // Fallback sui layout predefiniti in caso di errore
    const defaultLayout = defaultLayouts.find(layout => layout.isDefault) || defaultLayouts[0];
    
    return {
      layouts: defaultLayouts,
      defaultLayout,
      error: "Si è verificato un errore durante il caricamento dei layout."
    };
  }
};

// Salva i layout in localStorage
export const saveLayouts = async (
  layouts: PrintLayout[]
): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Assicurati che non stiamo salvando null o undefined
    if (!layouts) {
      return { 
        success: false, 
        error: "Impossibile salvare layout null o undefined" 
      };
    }
    
    localStorage.setItem(LAYOUTS_STORAGE_KEY, JSON.stringify(layouts));
    return { success: true, error: null };
  } catch (err) {
    console.error("Errore durante il salvataggio dei layout:", err);
    return { 
      success: false, 
      error: "Si è verificato un errore durante il salvataggio dei layout." 
    };
  }
};
