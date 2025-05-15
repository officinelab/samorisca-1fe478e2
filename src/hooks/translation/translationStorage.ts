import { supabase } from '@/integrations/supabase/client';
import { SupportedLanguage } from '@/types/translation';

// 1. Salvare SOLO su 'translations', NON più nei campi localizzati delle tabelle madre
export const saveTranslation = async (
  entityId: string,
  entityType: string,
  field: string,
  originalText: string,
  translatedText: string,
  language: SupportedLanguage
): Promise<boolean> => {
  try {
    // Aggiorna/crea la traduzione nella tabella translations
    const { data: existingTranslation } = await supabase
      .from('translations')
      .select('*')
      .eq('entity_id', entityId)
      .eq('entity_type', entityType)
      .eq('field', field)
      .eq('language', language)
      .single();

    if (existingTranslation) {
      await supabase
        .from('translations')
        .update({
          translated_text: translatedText,
          original_text: originalText,
          last_updated: new Date().toISOString()
        })
        .eq('id', existingTranslation.id);
    } else {
      await supabase
        .from('translations')
        .insert([{
          entity_id: entityId,
          entity_type: entityType,
          field,
          original_text: originalText,
          translated_text: translatedText,
          language
        }]);
    }

    return true;
  } catch (error) {
    console.error('Error saving translation:', error);
    return false;
  }
};

export const getExistingTranslation = async (
  entityId: string,
  entityType: string,
  field: string,
  language: SupportedLanguage
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('translations')
      .select('translated_text')
      .eq('entity_id', entityId)
      .eq('entity_type', entityType)
      .eq('field', field)
      .eq('language', language)
      .single();

    if (error || !data) {
      return null;
    }

    return data.translated_text;
  } catch (error) {
    console.error('Error fetching existing translation:', error);
    return null;
  }
};

// Lasciare vuota la funzione di aggiornamento diretto, per compatibilità futura
const updateEntityDirectFieldMinimal = async (
  entityId: string,
  entityType: string,
  field: string,
  translatedText: string,
  language: SupportedLanguage
): Promise<void> => {
  // Non fa più nulla
};
