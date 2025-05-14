
import { supabase } from '@/integrations/supabase/client';
import { SupportedLanguage } from '@/types/translation';

export const saveTranslation = async (
  entityId: string,
  entityType: string,
  field: string,
  originalText: string,
  translatedText: string,
  language: SupportedLanguage
): Promise<boolean> => {
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

const updateEntityDirectField = async (
  entityId: string,
  entityType: string,
  field: string,
  translatedText: string,
  language: SupportedLanguage
): Promise<void> => {
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
