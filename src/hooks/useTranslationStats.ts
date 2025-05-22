
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SupportedLanguage, TranslationStats } from '@/types/translation';

// Nuovo helper che replica la logica della MissingTranslationsTab
const translatableFieldsMap = {
  categories: ["title", "description"],
  products: ["title", "description", "price_suffix", "price_variant_1_name", "price_variant_2_name"],
  allergens: ["title", "description"],
  product_features: ["title"],
  product_labels: ["title"],
};

export const useTranslationStats = (language: SupportedLanguage) => {
  const [stats, setStats] = useState<TranslationStats>({
    total: 0,
    translated: 0,
    untranslated: 0,
    percentage: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        let totalFields = 0;
        const missedFields: { entityType: string; id: string; field: string; value: string }[] = [];

        // Per tutti i tipi entità
        for (const entityType of Object.keys(translatableFieldsMap) as Array<keyof typeof translatableFieldsMap>) {
          // Recupera tutti i record originari
          let selectFields = ["id", ...translatableFieldsMap[entityType]];
          const { data: entities, error } = await supabase
            .from(entityType)
            .select(selectFields.join(", "));

          if (error || !entities) continue;
          // Per ogni entity conta SOLO i campi con valore non vuoto
          for (const entity of entities as any[]) {
            translatableFieldsMap[entityType].forEach(field => {
              // Campo valido solo se non vuoto/null (come in tab “Voci da tradurre”)
              const value = entity[field];
              if (
                value !== undefined &&
                value !== null &&
                (typeof value !== "string" || value.trim() !== "")
              ) {
                totalFields++;
                missedFields.push({ entityType, id: entity.id, field, value: String(value) });
              }
            });
          }
        }

        // Recupera tutte le traduzioni per questa lingua (entità+campo+id+campo deve combaciare)
        const { data: allTranslations, error: translationsError } = await supabase
          .from('translations')
          .select('entity_type, entity_id, field')
          .eq('language', language);

        if (translationsError) {
          console.error('Error fetching translations:', translationsError);
          setStats({
            total: totalFields,
            translated: 0,
            untranslated: totalFields,
            percentage: 0,
          });
          setIsLoading(false);
          return;
        }

        // Mappa per lookup rapidissimo
        const translationsSet = new Set(
          (allTranslations || []).map(
            t => `${t.entity_type}:${t.entity_id}:${t.field}`
          )
        );

        // Quanti dei campi che ci servono davvero hanno già una traduzione?
        let translatedCount = 0;
        const untranslatedDebug: { entityType: string; id: string; field: string; value: string }[] = [];

        for (const f of missedFields) {
          const lookupKey = `${f.entityType}:${f.id}:${f.field}`;
          if (translationsSet.has(lookupKey)) {
            translatedCount++;
          } else {
            untranslatedDebug.push(f);
          }
        }

        const untranslatedCount = totalFields - translatedCount;
        const percentage = totalFields > 0 ? Math.round((translatedCount / totalFields) * 100) : 0;

        setStats({
          total: totalFields,
          translated: translatedCount,
          untranslated: untranslatedCount,
          percentage
        });

        // DEBUG: Mostra in console la lista dei campi che mancano secondo la progress bar:
        if (untranslatedDebug.length > 0) {
          console.log(
            "[STATISTICHE MULTILINGUA][DEBUG] Campi ancora ritenuti da tradurre nella progress bar:",
            untranslatedDebug
          );
        } else {
          console.log("[STATISTICHE MULTILINGUA][DEBUG] Tutti i campi sono tradotti secondo la progress bar.");
        }

      } catch (error) {
        console.error('Error calculating translation stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [language]);

  return { stats, isLoading };
};
