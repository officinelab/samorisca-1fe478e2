
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

// Chiave utilizzata nella tabella site_settings per il logo di stampa
const PRINT_LOGO_KEY = 'print_logo';

/**
 * Hook per gestire il logo dell'anteprima della pagina prints
 * Questo logo è distinto dal logo del menu pubblico
 */
export const usePrintLogoStorage = () => {
  const [printLogo, setPrintLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carica il logo dalla tabella site_settings di Supabase
  useEffect(() => {
    const loadPrintLogo = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', PRINT_LOGO_KEY)
          .single();

        if (error) {
          console.error('Errore durante il caricamento del logo di stampa:', error);
          if (error.code !== 'PGRST116') { // Ignora errore "no rows found"
            toast.error('Errore durante il caricamento del logo di stampa');
          }
          setPrintLogo(null);
        } else if (data) {
          // Il valore viene salvato come stringa nella colonna value
          const logoUrl = data.value as string;
          setPrintLogo(logoUrl);
        }
      } catch (error) {
        console.error('Errore imprevisto durante il caricamento del logo:', error);
        toast.error('Errore durante il caricamento del logo di stampa');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPrintLogo();
  }, []);

  // Aggiorna il logo su Supabase
  const updatePrintLogo = async (logoUrl: string) => {
    try {
      // Verifica se esiste già una riga con questa chiave
      const { data, error: checkError } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', PRINT_LOGO_KEY)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let saveError;

      if (data) {
        // Se esiste già, aggiorniamo il valore
        const { error } = await supabase
          .from('site_settings')
          .update({ value: logoUrl, updated_at: new Date().toISOString() })
          .eq('key', PRINT_LOGO_KEY);
        
        saveError = error;
      } else {
        // Se non esiste, inseriamo una nuova riga
        const { error } = await supabase
          .from('site_settings')
          .insert([{ key: PRINT_LOGO_KEY, value: logoUrl }]);
        
        saveError = error;
      }

      if (saveError) {
        throw saveError;
      }

      setPrintLogo(logoUrl);
      toast.success('Logo di stampa salvato con successo');
      
      return true;
    } catch (error) {
      console.error("Errore durante il salvataggio del logo di stampa:", error);
      toast.error("Errore durante il salvataggio del logo di stampa");
      return false;
    }
  };

  return {
    printLogo,
    updatePrintLogo,
    isLoading
  };
};
