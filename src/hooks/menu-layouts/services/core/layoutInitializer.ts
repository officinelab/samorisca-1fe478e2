
import { supabase } from "@/integrations/supabase/client";
import { PrintLayout } from "@/types/printLayout";
import { defaultLayouts } from "../../utils/defaultLayouts";
import { transformLayoutToDb, transformDbToLayout } from "./layoutTransformer";
import { v4 as uuidv4 } from "uuid";

export async function initializeDefaultLayouts(): Promise<{
  success: boolean;
  layouts?: PrintLayout[];
  error?: string;
}> {
  try {
    // Trasforma i layout predefiniti aggiungendo UUID
    const layoutsWithId = defaultLayouts.map(layout => ({
      ...layout,
      id: uuidv4()
    }));

    // Salva i layout predefiniti su Supabase
    const dbLayouts = layoutsWithId.map(transformLayoutToDb);
    
    const { data, error } = await supabase
      .from('print_layouts')
      .insert(dbLayouts)
      .select();

    if (error) {
      console.error("Errore nell'inizializzazione dei layout predefiniti:", error);
      return {
        success: false,
        error: `Errore nell'inizializzazione dei layout predefiniti: ${error.message}`
      };
    }

    // Trasforma i layout salvati nel formato dell'applicazione
    const savedLayouts = data.map(transformDbToLayout);

    return {
      success: true,
      layouts: savedLayouts
    };
  } catch (err) {
    console.error("Errore imprevisto durante l'inizializzazione dei layout predefiniti:", err);
    return {
      success: false,
      error: "Errore imprevisto durante l'inizializzazione dei layout predefiniti"
    };
  }
}
