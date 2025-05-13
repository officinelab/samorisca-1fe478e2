
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SupportedLanguage, TranslationResult } from '@/types/translation';
import { toast } from '@/components/ui/sonner';

export const useTranslationService = () => {
  const [isTranslating, setIsTranslating] = useState(false);

  const translateText = async (
    text: string,
    targetLanguage: SupportedLanguage,
    entityId: string,
    entityType: string,
    fieldName: string
  ): Promise<TranslationResult> => {
    if (!text || text.trim() === '') {
      return {
        success: false,
        translatedText: '',
        message: 'Il testo da tradurre non può essere vuoto'
      };
    }

    setIsTranslating(true);

    try {
      // Check remaining tokens before translation
      const { data: tokensData, error: tokensError } = await supabase
        .rpc('get_remaining_tokens');
      
      if (tokensError) {
        console.error('Error checking remaining tokens:', tokensError);
        toast.error('Errore durante la verifica dei token disponibili');
        return {
          success: false,
          translatedText: '',
          message: 'Errore durante la verifica dei token disponibili'
        };
      }

      if (tokensData <= 0) {
        toast.error('Token mensili esauriti. Riprova il prossimo mese.');
        return {
          success: false,
          translatedText: '',
          message: 'Token mensili esauriti. Riprova il prossimo mese.'
        };
      }

      // Call the Supabase Edge Function for translation
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

      // Save translation to database
      await saveTranslation(
        entityId,
        entityType,
        fieldName,
        text,
        data.translatedText,
        targetLanguage
      );

      toast.success('Traduzione completata con successo');
      
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
    } finally {
      setIsTranslating(false);
    }
  };

  const saveTranslation = async (
    entityId: string,
    entityType: string,
    field: string,
    originalText: string,
    translatedText: string,
    language: SupportedLanguage
  ) => {
    try {
      // Check if translation already exists
      const { data: existingTranslation } = await supabase
        .from('translations')
        .select('*')
        .eq('entity_id', entityId)
        .eq('entity_type', entityType)
        .eq('field', field)
        .eq('language', language)
        .single();

      if (existingTranslation) {
        // Update existing translation
        await supabase
          .from('translations')
          .update({
            translated_text: translatedText,
            original_text: originalText,
            last_updated: new Date().toISOString()
          })
          .eq('id', existingTranslation.id);
      } else {
        // Create new translation
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

      // Update direct field in the corresponding table if applicable
      await updateEntityDirectField(entityId, entityType, field, translatedText, language);

      return true;
    } catch (error) {
      console.error('Error saving translation:', error);
      return false;
    }
  };

  const updateEntityDirectField = async (
    entityId: string,
    entityType: string,
    field: string,
    translatedText: string,
    language: SupportedLanguage
  ) => {
    try {
      const langSuffix = `_${language}`;
      const targetField = `${field}${langSuffix}`;
      
      // Update the field in the appropriate table
      switch (entityType) {
        case 'categories':
          await supabase
            .from('categories')
            .update({ [targetField]: translatedText })
            .eq('id', entityId);
          break;
        case 'products':
          await supabase
            .from('products')
            .update({ [targetField]: translatedText })
            .eq('id', entityId);
          break;
        case 'allergens':
          await supabase
            .from('allergens')
            .update({ [targetField]: translatedText })
            .eq('id', entityId);
          break;
        case 'product_features':
          await supabase
            .from('product_features')
            .update({ [targetField]: translatedText })
            .eq('id', entityId);
          break;
        case 'product_labels':
          // Check if the field exists in product_labels
          if (field === 'title') {
            await supabase
              .from('product_labels')
              .update({ [targetField]: translatedText })
              .eq('id', entityId);
          }
          break;
        default:
          console.log(`No direct field update for entity type: ${entityType}`);
      }
    } catch (error) {
      console.error('Error updating entity field:', error);
    }
  };

  const getExistingTranslation = async (
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

  return {
    translateText,
    saveTranslation,
    getExistingTranslation,
    isTranslating
  };
};
