
import { PrintLayout } from "@/types/printLayout";
import { defaultLayouts } from "./defaultLayouts";
import { LAYOUTS_STORAGE_KEY } from "./constants";

// Carica i layout salvati o quelli predefiniti
export const loadLayouts = (): { 
  layouts: PrintLayout[]; 
  defaultLayout: PrintLayout | null;
  error: string | null;
} => {
  try {
    const savedLayouts = localStorage.getItem(LAYOUTS_STORAGE_KEY);
    
    if (savedLayouts) {
      const parsedLayouts = JSON.parse(savedLayouts);
      
      // Ensure we have a valid array
      if (!Array.isArray(parsedLayouts) || parsedLayouts.length === 0) {
        throw new Error("Invalid layouts data structure");
      }
      
      const defaultLayout = parsedLayouts.find((layout: PrintLayout) => layout.isDefault) || parsedLayouts[0];
      
      return {
        layouts: parsedLayouts,
        defaultLayout,
        error: null
      };
    } else {
      // Se non ci sono layout salvati, usa quelli predefiniti
      const defaultLayout = defaultLayouts.find(layout => layout.isDefault) || defaultLayouts[0];
      
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
export const saveLayouts = (
  layouts: PrintLayout[]
): { success: boolean; error: string | null } => {
  try {
    // Ensure we're not saving null or undefined
    if (!layouts) {
      return { 
        success: false, 
        error: "Cannot save null or undefined layouts" 
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
