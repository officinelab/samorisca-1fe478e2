
import { supabase } from "@/integrations/supabase/client";

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
