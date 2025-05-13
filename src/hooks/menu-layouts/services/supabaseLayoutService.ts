import { PrintLayout } from "@/types/printLayout";
import { supabaseClient } from "@/integrations/supabase/client";

// Interfaccia per il servizio di gestione dei layout di stampa
export interface LayoutService {
  getLayouts: () => Promise<{ data: PrintLayout[] | null; error: any }>;
  getLayout: (layoutId: string) => Promise<{ data: PrintLayout | null; error: any }>;
  createLayout: (layout: Omit<PrintLayout, 'id'>) => Promise<{ data: PrintLayout | null; error: any }>;
  updateLayout: (layout: PrintLayout) => Promise<{ data: PrintLayout | null; error: any }>;
  deleteLayout: (layoutId: string) => Promise<{ data: PrintLayout | null; error: any }>;
  setDefaultLayout: (layoutId: string) => Promise<{ data: PrintLayout | null; error: any }>;
}

// Implementazione del servizio utilizzando Supabase
class SupabaseLayoutService implements LayoutService {
  /**
   * Recupera tutti i layout di stampa dal database
   */
  async getLayouts() {
    try {
      const { data, error } = await supabaseClient
        .from('print_layouts')
        .select('*')
        .order('created_at', { ascending: false });
      
      return { data, error };
    } catch (error) {
      console.error('Errore nel recupero dei layout:', error);
      return { data: null, error };
    }
  }

  /**
   * Recupera un layout specifico dal database
   * @param layoutId ID del layout da recuperare
   */
  async getLayout(layoutId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('print_layouts')
        .select('*')
        .eq('id', layoutId)
        .single();
      
      return { data, error };
    } catch (error) {
      console.error(`Errore nel recupero del layout ${layoutId}:`, error);
      return { data: null, error };
    }
  }

  /**
   * Crea un nuovo layout nel database
   * @param layout Dati del layout da creare
   */
  async createLayout(layout: Omit<PrintLayout, 'id'>) {
    try {
      const { data, error } = await supabaseClient
        .from('print_layouts')
        .insert([layout])
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      console.error('Errore nella creazione del layout:', error);
      return { data: null, error };
    }
  }

  /**
   * Aggiorna un layout esistente
   * @param layout Layout aggiornato
   */
  async updateLayout(layout: PrintLayout) {
    try {
      const { data, error } = await supabaseClient
        .from('print_layouts')
        .update(layout)
        .eq('id', layout.id)
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      console.error(`Errore nell'aggiornamento del layout ${layout.id}:`, error);
      return { data: null, error };
    }
  }

  /**
   * Elimina un layout
   * @param layoutId ID del layout da eliminare
   */
  async deleteLayout(layoutId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('print_layouts')
        .delete()
        .eq('id', layoutId)
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      console.error(`Errore nell'eliminazione del layout ${layoutId}:`, error);
      return { data: null, error };
    }
  }

  /**
   * Imposta un layout come predefinito
   * @param layoutId ID del layout da impostare come predefinito
   */
  async setDefaultLayout(layoutId: string) {
    try {
      // Prima disabilita tutti i layout predefiniti
      await supabaseClient
        .from('print_layouts')
        .update({ is_default: false })
        .neq('id', layoutId);
      
      // Poi imposta il nuovo layout predefinito
      const { data, error } = await supabaseClient
        .from('print_layouts')
        .update({ is_default: true })
        .eq('id', layoutId)
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      console.error(`Errore nell'impostare il layout ${layoutId} come predefinito:`, error);
      return { data: null, error };
    }
  }
}

// Crea una singola istanza del servizio
export const supabaseApi = new SupabaseLayoutService();
