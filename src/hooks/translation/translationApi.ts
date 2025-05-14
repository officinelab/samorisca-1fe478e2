
import { supabase } from '@/integrations/supabase/client';
import { SupportedLanguage, TranslationServiceType } from '@/types/translation';
import { toast } from '@/components/ui/use-toast';
import { TranslationResult } from './types';

export const checkRemainingTokens = async (): Promise<number | null> => {
  try {
    const { data, error } = await supabase.rpc('get_remaining_tokens');
    
    if (error) {
      console.error('Error checking remaining tokens:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Errore durante la verifica dei token disponibili"
      });
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error checking tokens:', error);
    return null;
  }
};

export const translateTextViaEdgeFunction = async (
  text: string,
  targetLanguage: SupportedLanguage,
  entityId: string,
  entityType: string,
  fieldName: string,
  serviceType: TranslationServiceType = 'perplexity'
): Promise<TranslationResult> => {
  try {
    // Scegliamo esplicitamente il nome della funzione edge in base al servizio selezionato
    let functionName = 'translate'; // Default a perplexity
    
    if (serviceType === 'deepl') {
      functionName = 'translate-deepl';
    } else if (serviceType === 'openai') {
      functionName = 'translate-openai';
    }
    
    // Debug log più dettagliato
    console.log(`Chiamando edge function "${functionName}" per traduzione con servizio: ${serviceType}`);
    console.log(`Testo da tradurre: "${text}" in lingua: ${targetLanguage}`);
    
    // Debug speciale per "GAMBERO CRUDO"
    if (text === "GAMBERO CRUDO") {
      console.log(`[DEBUG-SPECIAL] Invio richiesta specifica per traduzione di "GAMBERO CRUDO":`, {
        body: {
          text,
          targetLanguage,
          entityId,
          entityType,
          fieldName
        }
      });
    }

    try {
      const startTime = Date.now();
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          text,
          targetLanguage,
          entityId,
          entityType,
          fieldName
        },
      });
      const endTime = Date.now();
      
      // Log del tempo di risposta per debug
      console.log(`[API-TIMING] Edge function ${functionName} ha risposto in ${endTime - startTime}ms`);

      if (error) {
        console.error(`Errore di traduzione con ${serviceType}:`, error);
        
        // Messaggio di errore più specifico per i problemi di connessione
        if (error.message && error.message.includes('Failed to send a request')) {
          toast({
            variant: "destructive",
            title: "Errore di connessione",
            description: `Impossibile contattare la funzione Edge "${functionName}". Verifica che sia correttamente deployata.`
          });
          return {
            success: false,
            translatedText: '',
            message: `Errore di connessione: ${error.message}. Verifica che Supabase sia configurato correttamente e che la funzione edge sia attiva.`,
            service: serviceType
          };
        }
        
        if (error.message && error.message.includes('non-2xx status code')) {
          // Errore specifico per i codici di stato non 2xx
          const statusMatch = error.message.match(/status code (\d+)/);
          const statusCode = statusMatch ? statusMatch[1] : 'sconosciuto';
          console.error(`[ERROR] Ricevuto status code ${statusCode} dalla funzione edge`);
        }
        
        toast({
          variant: "destructive",
          title: "Errore di traduzione",
          description: error.message || "Errore sconosciuto"
        });
        return {
          success: false,
          translatedText: '',
          message: `Errore durante la traduzione: ${error.message}`,
          service: serviceType
        };
      }

      if (!data?.translatedText) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: "Nessun testo tradotto ricevuto"
        });
        return {
          success: false,
          translatedText: '',
          message: 'Nessun testo tradotto ricevuto',
          service: serviceType
        };
      }

      console.log(`Risultato della traduzione da ${serviceType}: "${data.translatedText}"`);
      
      return {
        success: true,
        translatedText: data.translatedText,
        service: serviceType
      };
    } catch (invocationError) {
      console.error(`Errore nell'invocazione della funzione ${functionName}:`, invocationError);
      console.error('Stack trace completo:', invocationError.stack);
      
      toast({
        variant: "destructive", 
        title: "Errore",
        description: `Errore nell'invocazione della funzione: ${invocationError.message}`
      });
      
      return {
        success: false,
        translatedText: '',
        message: `Errore nell'invocazione della funzione: ${invocationError.message}`,
        service: serviceType
      };
    }
  } catch (error) {
    console.error('Errore del servizio di traduzione:', error);
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
    toast({
      variant: "destructive",
      title: "Errore",
      description: `Errore del servizio di traduzione: ${errorMessage}`
    });
    
    return {
      success: false,
      translatedText: '',
      message: `Errore del servizio di traduzione: ${errorMessage}`,
      service: serviceType
    };
  }
};
