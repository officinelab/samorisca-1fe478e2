
import { supabase } from '@/integrations/supabase/client';
import { SupportedLanguage, TranslationServiceType } from '@/types/translation';
import { toast } from '@/components/ui/sonner';
import { TranslationResult } from './types';

export const checkRemainingTokens = async (): Promise<number | null> => {
  try {
    const { data, error } = await supabase.rpc('get_remaining_tokens');
    
    if (error) {
      console.error('Error checking remaining tokens:', error);
      toast.error('Errore durante la verifica dei token disponibili');
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
    // Choose the appropriate service endpoint
    const functionName = serviceType === 'deepl' ? 'translate-deepl' : 'translate';
    
    console.log(`Calling ${functionName} edge function for text: "${text}"`); // Debug log
    console.log(`Using translation service: ${serviceType}`); // Debug log for service type
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: {
        text,
        targetLanguage,
        entityId,
        entityType,
        fieldName
      },
    });

    if (error) {
      console.error(`Translation error (${serviceType}):`, error);
      toast.error(`Errore durante la traduzione: ${error.message}`);
      return {
        success: false,
        translatedText: '',
        message: `Errore durante la traduzione: ${error.message}`
      };
    }

    if (!data?.translatedText) {
      toast.error('Nessun testo tradotto ricevuto');
      return {
        success: false,
        translatedText: '',
        message: 'Nessun testo tradotto ricevuto'
      };
    }

    console.log(`Translation result from ${serviceType}: "${data.translatedText}"`); // Debug log
    
    return {
      success: true,
      translatedText: data.translatedText
    };
  } catch (error) {
    console.error('Translation service error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
    toast.error(`Errore del servizio di traduzione: ${errorMessage}`);
    
    return {
      success: false,
      translatedText: '',
      message: `Errore del servizio di traduzione: ${errorMessage}`
    };
  }
};
