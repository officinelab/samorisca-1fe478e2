
import { toast } from '@/components/ui/use-toast';
import { TranslationServiceType } from '@/types/translation';
import { TranslationResult } from '../types';

export const handleApiError = (error: any, serviceType: TranslationServiceType, functionName: string): TranslationResult => {
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
};

export const handleGeneralError = (error: unknown, serviceType: TranslationServiceType): TranslationResult => {
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
};
