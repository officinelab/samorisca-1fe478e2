
import { supabase } from '@/integrations/supabase/client';
import { SupportedLanguage, TranslationServiceType } from '@/types/translation';
import { TranslationResult } from '../types';
import { getServiceFunctionName } from './serviceMapper';
import { handleApiError } from './errorHandler';

export const callTranslationEdgeFunction = async (
  text: string,
  targetLanguage: SupportedLanguage,
  entityId: string,
  entityType: string,
  fieldName: string,
  serviceType: TranslationServiceType
): Promise<TranslationResult> => {
  try {
    const functionName = getServiceFunctionName(serviceType);
    
    console.log(`Chiamando edge function "${functionName}" per traduzione con servizio: ${serviceType}`);
    console.log(`Testo da tradurre: "${text}" in lingua: ${targetLanguage}`);
    
    // Debug speciale per "GAMBERO CRUDO"
    if (text === "GAMBERO CRUDO") {
      console.log(`[DEBUG-SPECIAL] Invio richiesta specifica per traduzione di "GAMBERO CRUDO":`, {
        body: { text, targetLanguage, entityId, entityType, fieldName }
      });
    }

    const startTime = Date.now();
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: { text, targetLanguage, entityId, entityType, fieldName },
    });
    const endTime = Date.now();
    
    console.log(`[API-TIMING] Edge function ${functionName} ha risposto in ${endTime - startTime}ms`);

    if (error) {
      return handleApiError(error, serviceType, functionName);
    }

    if (!data?.translatedText) {
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
    console.error(`Errore nell'invocazione della funzione ${getServiceFunctionName(serviceType)}:`, invocationError);
    console.error('Stack trace completo:', invocationError.stack);
    
    return {
      success: false,
      translatedText: '',
      message: `Errore nell'invocazione della funzione: ${invocationError.message}`,
      service: serviceType
    };
  }
};
