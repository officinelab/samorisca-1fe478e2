
import { supabase } from "@/integrations/supabase/client";
import { PrintLayout } from "@/types/printLayout";
import { transformLayoutToDb, transformDbToLayout } from "./layoutTransformer";

export const saveLayoutToSupabase = async (layout: PrintLayout): Promise<{
  success: boolean;
  error: string | null;
  layout?: PrintLayout;
}> => {
  try {
    // Prepara il layout per il salvataggio su DB
    const dbLayout = transformLayoutToDb(layout);
    
    const { data, error } = await supabase
      .from('print_layouts')
      .upsert(dbLayout)
      .select()
      .single();

    if (error) {
      console.error("Errore nel salvataggio del layout:", error);
      
      // Gestisci l'errore del limite di 4 layout
      if (error.message.includes('Non è possibile creare più di 4 layout')) {
        return {
          success: false,
          error: "Non è possibile creare più di 4 layout"
        };
      }
      
      return {
        success: false,
        error: `Errore nel salvataggio del layout: ${error.message}`
      };
    }

    // Trasforma il layout salvato nel formato dell'applicazione
    const savedLayout = transformDbToLayout(data);

    return {
      success: true,
      error: null,
      layout: savedLayout
    };
  } catch (err) {
    console.error("Errore imprevisto durante il salvataggio del layout:", err);
    return {
      success: false,
      error: "Errore imprevisto durante il salvataggio del layout"
    };
  }
};
