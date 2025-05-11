
import { PrintLayout } from "@/types/printLayout";
import { defaultLayouts } from "./defaultLayouts";
import { LAYOUTS_STORAGE_KEY } from "./constants";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

// Carica i layout salvati da Supabase o quelli predefiniti
export const loadLayouts = async (): Promise<{ 
  layouts: PrintLayout[]; 
  defaultLayout: PrintLayout | null;
  error: string | null;
}> => {
  try {
    // Prima prova a caricare i layout da Supabase
    const { data: supabaseLayouts, error } = await supabase
      .from('print_layouts')
      .select('*');

    if (error) {
      console.error("Errore nel recupero dei layout da Supabase:", error);
      throw error;
    }
    
    // Se ci sono layout salvati su Supabase
    if (supabaseLayouts && supabaseLayouts.length > 0) {
      // Converti i dati JSON in oggetti JavaScript
      const parsedLayouts = supabaseLayouts.map(layout => {
        // Assicurati che i campi necessari siano presenti e convertiti correttamente
        return {
          id: layout.id,
          name: layout.name,
          type: layout.type,
          isDefault: layout.is_default,
          elements: typeof layout.elements === 'string' ? JSON.parse(layout.elements) : layout.elements,
          spacing: typeof layout.spacing === 'string' ? JSON.parse(layout.spacing) : layout.spacing,
          page: typeof layout.page === 'string' ? JSON.parse(layout.page) : layout.page
        } as PrintLayout;
      });
      
      const defaultLayout = parsedLayouts.find((layout) => layout.isDefault) || parsedLayouts[0];
      
      return {
        layouts: parsedLayouts,
        defaultLayout,
        error: null
      };
    } 
    
    // Fallback su localStorage se non ci sono layout su Supabase
    const savedLayouts = localStorage.getItem(LAYOUTS_STORAGE_KEY);
    
    if (savedLayouts) {
      const parsedLayouts = JSON.parse(savedLayouts);
      
      // Assicurati che abbiamo un array valido
      if (!Array.isArray(parsedLayouts) || parsedLayouts.length === 0) {
        throw new Error("Struttura dati layout non valida");
      }
      
      const defaultLayout = parsedLayouts.find((layout: PrintLayout) => layout.isDefault) || parsedLayouts[0];
      
      // Salva questi layout su Supabase per il futuro
      await migrateLayoutsToSupabase(parsedLayouts);
      
      return {
        layouts: parsedLayouts,
        defaultLayout,
        error: null
      };
    } else {
      // Se non ci sono layout salvati, usa quelli predefiniti
      const defaultLayout = defaultLayouts.find(layout => layout.isDefault) || defaultLayouts[0];
      
      // Salva i layout predefiniti su Supabase
      await migrateLayoutsToSupabase(defaultLayouts);
      
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

// Salva i layout in Supabase
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
    
    // Backup su localStorage
    localStorage.setItem(LAYOUTS_STORAGE_KEY, JSON.stringify(layouts));
    
    // Prepara i dati da salvare su Supabase
    const supabaseLayouts = layouts.map(layout => ({
      id: layout.id,
      name: layout.name,
      type: layout.type,
      is_default: layout.isDefault,
      elements: layout.elements,
      spacing: layout.spacing,
      page: layout.page
    }));
    
    // Pulisci la tabella dei layout
    const { error: deleteError } = await supabase
      .from('print_layouts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // elimina tutto
    
    if (deleteError) {
      console.error("Errore durante la pulizia della tabella layout:", deleteError);
      return { 
        success: false, 
        error: "Si è verificato un errore durante il salvataggio dei layout." 
      };
    }
    
    // Inserisci i nuovi layout
    const { error: insertError } = await supabase
      .from('print_layouts')
      .insert(supabaseLayouts);
    
    if (insertError) {
      console.error("Errore durante l'inserimento dei layout:", insertError);
      return { 
        success: false, 
        error: "Si è verificato un errore durante il salvataggio dei layout." 
      };
    }
    
    return { success: true, error: null };
  } catch (err) {
    console.error("Errore durante il salvataggio dei layout:", err);
    return { 
      success: false, 
      error: "Si è verificato un errore durante il salvataggio dei layout." 
    };
  }
};

// Funzione per migrare i layout dal localStorage a Supabase
const migrateLayoutsToSupabase = async (layouts: PrintLayout[]) => {
  try {
    // Prepara i dati da salvare su Supabase
    const supabaseLayouts = layouts.map(layout => ({
      id: layout.id,
      name: layout.name,
      type: layout.type,
      is_default: layout.isDefault,
      elements: layout.elements,
      spacing: layout.spacing,
      page: layout.page
    }));
    
    // Pulisci la tabella
    await supabase
      .from('print_layouts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Inserisci i layout
    const { error } = await supabase
      .from('print_layouts')
      .insert(supabaseLayouts);
    
    if (error) {
      console.error("Errore durante la migrazione dei layout a Supabase:", error);
    }
  } catch (err) {
    console.error("Errore durante la migrazione dei layout:", err);
  }
};
