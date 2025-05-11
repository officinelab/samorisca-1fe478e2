
import { PrintLayout } from "@/types/printLayout";
import { defaultLayouts } from "./defaultLayouts";
import { LAYOUTS_STORAGE_KEY } from "./constants";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

// Type for Supabase response
type PrintLayoutRow = {
  id: string;
  name: string;
  type: string;
  is_default: boolean;
  elements: string | object;
  spacing: string | object;
  page: string | object;
  created_at?: string;
  updated_at?: string;
};

// Convert Supabase row to PrintLayout
const mapRowToLayout = (row: PrintLayoutRow): PrintLayout => {
  return {
    id: row.id,
    name: row.name,
    type: row.type as PrintLayout['type'],
    isDefault: row.is_default,
    elements: typeof row.elements === 'string' ? JSON.parse(row.elements) : row.elements,
    spacing: typeof row.spacing === 'string' ? JSON.parse(row.spacing) : row.spacing,
    page: typeof row.page === 'string' ? JSON.parse(row.page) : row.page
  } as PrintLayout;
};

// Convert PrintLayout to Supabase row format
const mapLayoutToRow = (layout: PrintLayout): Omit<PrintLayoutRow, 'created_at' | 'updated_at'> => {
  return {
    id: layout.id,
    name: layout.name,
    type: layout.type,
    is_default: layout.isDefault,
    elements: layout.elements,
    spacing: layout.spacing,
    page: layout.page
  };
};

// Carica i layout salvati da Supabase o quelli predefiniti
export const loadLayouts = async (): Promise<{ 
  layouts: PrintLayout[]; 
  defaultLayout: PrintLayout | null;
  error: string | null;
}> => {
  try {
    // Prima prova a caricare i layout da Supabase
    const { data, error } = await supabase
      .from('print_layouts')
      .select('*') as { data: PrintLayoutRow[] | null, error: any };

    if (error) {
      console.error("Errore nel recupero dei layout da Supabase:", error);
      throw error;
    }
    
    // Se ci sono layout salvati su Supabase
    if (data && data.length > 0) {
      // Converti i dati in oggetti PrintLayout
      const parsedLayouts = data.map(mapRowToLayout);
      
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
    const supabaseLayouts = layouts.map(mapLayoutToRow);
    
    // Pulisci la tabella dei layout
    const { error: deleteError } = await supabase
      .from('print_layouts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') as { error: any };
    
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
      .insert(supabaseLayouts) as { error: any };
    
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
    const supabaseLayouts = layouts.map(mapLayoutToRow);
    
    // Pulisci la tabella
    const { error: deleteError } = await supabase
      .from('print_layouts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') as { error: any };
    
    if (deleteError) {
      console.error("Errore durante la pulizia della tabella layout:", deleteError);
      return;
    }
    
    // Inserisci i layout
    const { error: insertError } = await supabase
      .from('print_layouts')
      .insert(supabaseLayouts) as { error: any };
    
    if (insertError) {
      console.error("Errore durante la migrazione dei layout a Supabase:", insertError);
    }
  } catch (err) {
    console.error("Errore durante la migrazione dei layout:", err);
  }
};
