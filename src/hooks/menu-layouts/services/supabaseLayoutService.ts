import { supabase } from "@/integrations/supabase/client";
import { PrintLayout } from "@/types/printLayout";
import { toast } from "@/components/ui/sonner";
import { defaultLayouts } from "../utils/defaultLayouts";
import { v4 as uuidv4 } from "uuid";

// Recupera tutti i layout da Supabase
export const fetchLayoutsFromSupabase = async (): Promise<{
  layouts: PrintLayout[];
  defaultLayout: PrintLayout | null;
  error: string | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('print_layouts')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Errore nel recupero dei layout da Supabase:", error);
      return {
        layouts: [],
        defaultLayout: null,
        error: `Errore nel recupero dei layout: ${error.message}`
      };
    }

    // Se non ci sono layout, inizializza con quelli predefiniti
    if (!data || data.length === 0) {
      console.log("Nessun layout trovato, inizializzo con i layout predefiniti");
      const { success, layouts } = await initializeDefaultLayouts();
      
      if (!success || !layouts) {
        return {
          layouts: [],
          defaultLayout: null,
          error: "Errore nell'inizializzazione dei layout predefiniti"
        };
      }
      
      return {
        layouts,
        defaultLayout: layouts.find(layout => layout.isDefault) || layouts[0],
        error: null
      };
    }

    // Trasforma i dati dal formato DB al formato dell'applicazione
    const layouts = data.map(dbLayout => transformDbToLayout(dbLayout));
    const defaultLayout = layouts.find(layout => layout.isDefault) || layouts[0];

    return {
      layouts,
      defaultLayout,
      error: null
    };
  } catch (err) {
    console.error("Errore imprevisto durante il recupero dei layout:", err);
    return {
      layouts: [],
      defaultLayout: null,
      error: "Errore imprevisto durante il recupero dei layout"
    };
  }
};

// Salva un layout su Supabase
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

// Elimina un layout da Supabase
export const deleteLayoutFromSupabase = async (layoutId: string): Promise<{
  success: boolean;
  error: string | null;
}> => {
  try {
    // Prima verifico quanti layout ci sono
    const { count } = await supabase
      .from('print_layouts')
      .select('*', { count: 'exact', head: true });
    
    if (count === 1) {
      return {
        success: false,
        error: "Non è possibile eliminare l'ultimo layout rimanente"
      };
    }
    
    // Verifico se il layout è predefinito
    const { data: layoutData } = await supabase
      .from('print_layouts')
      .select('is_default')
      .eq('id', layoutId)
      .single();
      
    if (layoutData && layoutData.is_default) {
      // Se eliminiamo il layout predefinito, dobbiamo impostarne un altro come predefinito
      const { data: otherLayouts } = await supabase
        .from('print_layouts')
        .select('id')
        .neq('id', layoutId)
        .limit(1)
        .single();
        
      if (otherLayouts) {
        // Imposta un altro layout come predefinito
        await supabase
          .from('print_layouts')
          .update({ is_default: true })
          .eq('id', otherLayouts.id);
      }
    }

    const { error } = await supabase
      .from('print_layouts')
      .delete()
      .eq('id', layoutId);

    if (error) {
      console.error("Errore nell'eliminazione del layout:", error);
      return {
        success: false,
        error: `Errore nell'eliminazione del layout: ${error.message}`
      };
    }

    return {
      success: true,
      error: null
    };
  } catch (err) {
    console.error("Errore imprevisto durante l'eliminazione del layout:", err);
    return {
      success: false,
      error: "Errore imprevisto durante l'eliminazione del layout"
    };
  }
};

// Imposta un layout come predefinito
export const setLayoutAsDefault = async (layoutId: string): Promise<{
  success: boolean;
  error: string | null;
}> => {
  try {
    const { error } = await supabase
      .from('print_layouts')
      .update({ is_default: true })
      .eq('id', layoutId);

    if (error) {
      console.error("Errore nell'impostazione del layout predefinito:", error);
      return {
        success: false,
        error: `Errore nell'impostazione del layout predefinito: ${error.message}`
      };
    }

    return {
      success: true,
      error: null
    };
  } catch (err) {
    console.error("Errore imprevisto durante l'impostazione del layout predefinito:", err);
    return {
      success: false,
      error: "Errore imprevisto durante l'impostazione del layout predefinito"
    };
  }
};

// Funzioni di utilità per la conversione tra formati
function transformDbToLayout(dbLayout: any): PrintLayout {
  // Assicura che i nuovi campi margini esistano nel page object
  const pageWithDefaults = {
    ...dbLayout.page,
    coverMarginTop: dbLayout.page.coverMarginTop || 25,
    coverMarginRight: dbLayout.page.coverMarginRight || 25,
    coverMarginBottom: dbLayout.page.coverMarginBottom || 25,
    coverMarginLeft: dbLayout.page.coverMarginLeft || 25,
    allergensMarginTop: dbLayout.page.allergensMarginTop || 20,
    allergensMarginRight: dbLayout.page.allergensMarginRight || 15,
    allergensMarginBottom: dbLayout.page.allergensMarginBottom || 20,
    allergensMarginLeft: dbLayout.page.allergensMarginLeft || 15,
    useDistinctMarginsForAllergensPages: dbLayout.page.useDistinctMarginsForAllergensPages || false,
    allergensOddPages: dbLayout.page.allergensOddPages || {
      marginTop: 20,
      marginRight: 15,
      marginBottom: 20,
      marginLeft: 15
    },
    allergensEvenPages: dbLayout.page.allergensEvenPages || {
      marginTop: 20,
      marginRight: 15,
      marginBottom: 20,
      marginLeft: 15
    }
  };

  return {
    id: dbLayout.id,
    name: dbLayout.name,
    type: dbLayout.type,
    isDefault: dbLayout.is_default,
    productSchema: dbLayout.product_schema,
    elements: dbLayout.elements,
    cover: dbLayout.cover,
    allergens: dbLayout.allergens,
    categoryNotes: dbLayout.category_notes,
    productFeatures: dbLayout.product_features,
    servicePrice: dbLayout.service_price || {
      visible: true,
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#000000",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    spacing: dbLayout.spacing,
    page: pageWithDefaults
  };
}

function transformLayoutToDb(layout: PrintLayout): any {
  return {
    id: layout.id,
    name: layout.name,
    type: layout.type,
    is_default: layout.isDefault,
    product_schema: layout.productSchema,
    elements: layout.elements,
    cover: layout.cover,
    allergens: layout.allergens,
    category_notes: layout.categoryNotes,
    product_features: layout.productFeatures,
    service_price: layout.servicePrice,
    spacing: layout.spacing,
    page: layout.page
  };
}

// Inizializza i layout predefiniti su Supabase
async function initializeDefaultLayouts(): Promise<{
  success: boolean;
  layouts?: PrintLayout[];
  error?: string;
}> => {
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

export const mapSupabaseToLayout = (data: any): PrintLayout => {
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    isDefault: data.is_default,
    productSchema: data.product_schema,
    elements: data.elements,
    cover: data.cover,
    allergens: data.allergens,
    categoryNotes: data.category_notes,
    productFeatures: data.product_features,
    servicePrice: data.service_price || {
      visible: true,
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#000000",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    spacing: data.spacing,
    page: {
      ...data.page,
      coverMarginTop: data.page.coverMarginTop || 25,
      coverMarginRight: data.page.coverMarginRight || 25,
      coverMarginBottom: data.page.coverMarginBottom || 25,
      coverMarginLeft: data.page.coverMarginLeft || 25,
      allergensMarginTop: data.page.allergensMarginTop || 20,
      allergensMarginRight: data.page.allergensMarginRight || 15,
      allergensMarginBottom: data.page.allergensMarginBottom || 20,
      allergensMarginLeft: data.page.allergensMarginLeft || 15,
      useDistinctMarginsForAllergensPages: data.page.useDistinctMarginsForAllergensPages || false,
      allergensOddPages: data.page.allergensOddPages || {
        marginTop: 20,
        marginRight: 15,
        marginBottom: 20,
        marginLeft: 15
      },
      allergensEvenPages: data.page.allergensEvenPages || {
        marginTop: 20,
        marginRight: 15,
        marginBottom: 20,
        marginLeft: 15
      }
    },
  };
};
