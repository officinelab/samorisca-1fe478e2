
import { supabase } from '@/integrations/supabase/client';
import { SupportedLanguage } from '@/types/translation';
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
  fieldName: string
): Promise<TranslationResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('translate', {
      body: {
        text,
        targetLanguage,
        entityId,
        entityType,
        fieldName
      },
    });

    if (error) {
      console.error('Translation error:', error);
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
