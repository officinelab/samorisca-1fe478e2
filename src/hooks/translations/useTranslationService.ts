
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type SupportedLanguage = "en" | "fr" | "es" | "de";
export type LanguageLabel = "English" | "French" | "Spanish" | "German";

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageLabel> = {
  "en": "English",
  "fr": "French",
  "es": "Spanish",
  "de": "German",
};

export interface TranslationStats {
  total: number;
  translated: {
    en: number;
    fr: number;
    es: number;
    de: number;
  };
  untranslated: {
    en: number;
    fr: number;
    es: number;
    de: number;
  };
}

export interface TokenStats {
  used: number;
  limit: number;
  remaining: number;
}

export const useTranslationService = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null);

  // Ottiene le statistiche dei token
  const fetchTokenStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_remaining_tokens');
      
      if (error) throw error;
      
      const { data: usageData, error: usageError } = await supabase
        .from('translation_tokens')
        .select('tokens_used, tokens_limit')
        .eq('month', new Date().toISOString().slice(0, 7))
        .single();
      
      if (usageError && usageError.code !== 'PGRST116') {
        // PGRST116 è "nessun risultato", che è ok se non c'è un record per questo mese
        throw usageError;
      }
      
      const used = usageData?.tokens_used || 0;
      const limit = usageData?.tokens_limit || 300;
      
      setTokenStats({
        used,
        limit,
        remaining: data
      });
      
      return {
        used,
        limit,
        remaining: data
      };
    } catch (error) {
      console.error('Errore nel recupero delle statistiche dei token:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile recuperare le statistiche dei token.",
      });
      return null;
    }
  };

  // Traduce un testo
  const translateText = async (
    text: string,
    targetLanguage: SupportedLanguage,
    sourceLanguage: string = "Italian"
  ) => {
    try {
      setIsLoading(true);
      
      // Otteniamo l'URL corretto dalla variabile di ambiente
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      
      if (!supabaseUrl) {
        throw new Error("VITE_SUPABASE_URL non è definito");
      }
      
      // Otteniamo il token di autenticazione
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      
      if (!accessToken) {
        throw new Error("Token di autenticazione non disponibile");
      }
      
      console.log("Chiamando API di traduzione con URL:", `${supabaseUrl}/functions/v1/translate`);
      
      const response = await fetch(`${supabaseUrl}/functions/v1/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          text,
          targetLanguage: SUPPORTED_LANGUAGES[targetLanguage],
          sourceLanguage
        })
      });
      
      if (!response.ok) {
        // Log dettagliato in caso di errore
        const textResponse = await response.text();
        console.error('Risposta errore non-JSON:', textResponse);
        
        let errorMessage = `Errore HTTP: ${response.status}`;
        
        try {
          // Prova a convertire in JSON se possibile
          const errorData = JSON.parse(textResponse);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Se non è JSON, usa il testo completo
          if (textResponse && textResponse.length < 100) {
            errorMessage = textResponse;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      
      // Aggiorna le statistiche dei token
      await fetchTokenStats();
      
      return result.translatedText;
    } catch (error: any) {
      console.error('Errore nella traduzione:', error);
      
      if (error.message.includes('Limite mensile')) {
        toast({
          variant: "destructive",
          title: "Limite token raggiunto",
          description: "Hai raggiunto il limite mensile di token per le traduzioni.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Errore di traduzione",
          description: error.message || "Si è verificato un errore durante la traduzione.",
        });
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Salva una traduzione nel database
  const saveTranslation = async (
    entityType: string,
    entityId: string,
    field: string,
    language: SupportedLanguage,
    translatedText: string,
    originalText: string
  ) => {
    try {
      // Aggiorna la colonna specifica nella tabella principale
      let tableName = '';
      const columnName = `${field}_${language}`;
      
      switch (entityType) {
        case 'category':
          tableName = 'categories';
          break;
        case 'product':
          tableName = 'products';
          break;
        case 'allergen':
          tableName = 'allergens';
          break;
        case 'product_feature':
          tableName = 'product_features';
          break;
        default:
          throw new Error('Tipo di entità non supportato');
      }
      
      // Tipizziamo correttamente le tabelle
      // Aggiorna la tabella principale
      const { error: updateError } = await supabase
        .from(tableName as any)
        .update({ [columnName]: translatedText })
        .eq('id', entityId);
      
      if (updateError) throw updateError;
      
      // Salva anche nella tabella translations per tenere traccia di tutte le traduzioni
      const { error: insertError } = await supabase
        .from('translations')
        .upsert({
          entity_type: entityType,
          entity_id: entityId,
          field,
          language,
          translated_text: translatedText,
          original_text: originalText,
          last_updated: new Date().toISOString()
        }, { onConflict: 'entity_type,entity_id,field,language' });
      
      if (insertError) throw insertError;
      
      toast({
        title: "Traduzione salvata",
        description: `La traduzione in ${SUPPORTED_LANGUAGES[language]} è stata salvata con successo.`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Errore nel salvataggio della traduzione:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile salvare la traduzione nel database.",
      });
      return false;
    }
  };

  // Verifica se una traduzione esiste e se il testo originale è cambiato
  const checkTranslationStatus = async (
    entityType: string,
    entityId: string,
    field: string,
    language: SupportedLanguage,
    currentText: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('translated_text, original_text, last_updated')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('field', field)
        .eq('language', language)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 è "nessun risultato", che è ok se non c'è una traduzione
        throw error;
      }
      
      if (!data) {
        return { exists: false, needsUpdate: true, lastUpdated: null };
      }
      
      // Verifica se il testo originale è cambiato
      const needsUpdate = data.original_text !== currentText;
      
      return {
        exists: true,
        needsUpdate,
        lastUpdated: data.last_updated,
        currentTranslation: data.translated_text
      };
    } catch (error) {
      console.error('Errore nel controllo dello stato della traduzione:', error);
      return { exists: false, needsUpdate: true, lastUpdated: null };
    }
  };

  // Conta le traduzioni esistenti e mancanti per un tipo di entità
  const getTranslationStats = async (entityType: string): Promise<TranslationStats> => {
    try {
      // Inizializza le statistiche
      const stats: TranslationStats = {
        total: 0,
        translated: { en: 0, fr: 0, es: 0, de: 0 },
        untranslated: { en: 0, fr: 0, es: 0, de: 0 }
      };
      
      let tableName = '';
      
      switch (entityType) {
        case 'category':
          tableName = 'categories';
          break;
        case 'product':
          tableName = 'products';
          break;
        case 'allergen':
          tableName = 'allergens';
          break;
        case 'product_feature':
          tableName = 'product_features';
          break;
        default:
          throw new Error('Tipo di entità non supportato');
      }
      
      // Ottieni il conteggio totale
      const { count, error: countError } = await supabase
        .from(tableName as any)
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      stats.total = count || 0;
      
      // Ottieni il conteggio delle traduzioni in ogni lingua
      for (const lang of Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]) {
        // Titoli tradotti
        const { count: titleCount, error: titleError } = await supabase
          .from(tableName as any)
          .select('*', { count: 'exact', head: true })
          .not(`title_${lang}`, 'is', null);
          
        if (titleError) throw titleError;
        
        stats.translated[lang] = titleCount || 0;
        stats.untranslated[lang] = stats.total - stats.translated[lang];
        
        // Se l'entità ha anche una descrizione, potremmo contarla separatamente
        // Per ora ci concentriamo solo sui titoli
      }
      
      return stats;
    } catch (error) {
      console.error('Errore nel recupero delle statistiche di traduzione:', error);
      return {
        total: 0,
        translated: { en: 0, fr: 0, es: 0, de: 0 },
        untranslated: { en: 0, fr: 0, es: 0, de: 0 }
      };
    }
  };

  return {
    isLoading,
    tokenStats,
    translateText,
    saveTranslation,
    checkTranslationStatus,
    getTranslationStats,
    fetchTokenStats
  };
};
