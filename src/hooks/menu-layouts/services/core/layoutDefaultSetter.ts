
import { supabase } from "@/integrations/supabase/client";

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
