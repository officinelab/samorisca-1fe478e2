
import { TranslationServiceType } from '@/types/translation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

// Chiave per il localStorage (usata solo come fallback temporaneo)
const TRANSLATION_SERVICE_KEY = 'preferred_translation_service';

/**
 * Carica la preferenza del servizio di traduzione da Supabase
 */
export const loadServicePreference = async (): Promise<TranslationServiceType> => {
  try {
    // Prima prova a caricare da Supabase
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'translation_service')
      .single();
    
    if (error || !data) {
      // Fallback: carica da localStorage
      const savedService = localStorage.getItem(TRANSLATION_SERVICE_KEY);
      if (savedService && (savedService === 'deepl' || savedService === 'perplexity' || savedService === 'openai')) {
        const serviceType = savedService as TranslationServiceType;
        // Migra il valore da localStorage a Supabase
        await saveServicePreference(serviceType);
        return serviceType;
      }
      // Default se non trova nulla  
      return 'openai';
    } else {
      // Usa il valore da Supabase
      return data.value as TranslationServiceType;
    }
  } catch (error) {
    console.error('Errore nel caricamento delle preferenze del servizio di traduzione:', error);
    return 'openai'; // Default in caso di errore
  }
};

/**
 * Salva la preferenza del servizio di traduzione su Supabase
 */
export const saveServicePreference = async (service: TranslationServiceType): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'translation_service')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Errore nella verifica delle impostazioni esistenti:', error);
      return false;
    }

    if (data) {
      // Aggiorna l'impostazione esistente
      await supabase
        .from('site_settings')
        .update({ value: service })
        .eq('key', 'translation_service');
    } else {
      // Crea una nuova impostazione
      await supabase
        .from('site_settings')
        .insert([{ key: 'translation_service', value: service }]);
    }

    return true;
  } catch (error) {
    console.error('Errore nel salvataggio della preferenza del servizio:', error);
    return false;
  }
};
