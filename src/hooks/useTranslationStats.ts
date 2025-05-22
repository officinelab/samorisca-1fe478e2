
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
        // Lista di tutti i campi "valorizzati" (pronti da tradurre)
        const fieldsToCheck: { entityType: string; id: string; field: string; value: string; updated_at: string }[] = [];

        // Per tutti i tipi entità
        for (const entityType of Object.keys(translatableFieldsMap) as Array<keyof typeof translatableFieldsMap>) {
          // Recupera tutti i record originari
          let selectFields = ["id", "updated_at", ...translatableFieldsMap[entityType]];
          const { data: entities, error } = await supabase
            .from(entityType)
            .select(selectFields.join(", "));

          if (error || !entities) continue;
          // Per ogni entity conta SOLO i campi con valore non vuoto
          for (const entity of entities as any[]) {
            translatableFieldsMap[entityType].forEach(field => {
              const value = entity[field];
              // Campo valido solo se non vuoto/null (come in tab “Voci da tradurre”)
              if (
                value !== undefined &&
                value !== null &&
                (typeof value !== "string" || value.trim() !== "")
              ) {
                totalFields++;
                fieldsToCheck.push({ entityType, id: entity.id, field, value: String(value), updated_at: entity.updated_at });
              }
            });
          }
        }

        // Recupera tutte le traduzioni per questa lingua (entity_type+entity_id+field)
        const { data: allTranslations, error: translationsError } = await supabase
          .from('translations')
          .select('entity_type, entity_id, field, last_updated')
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

        // Mappa per lookup veloce delle traduzioni
        const translationsMap: Record<
          string, // lookupKey: entityType:entity_id:field
          { last_updated: string }
        > = {};
        (allTranslations || []).forEach(t => {
          const lookupKey = `${t.entity_type}:${t.entity_id}:${t.field}`;
          translationsMap[lookupKey] = {
            last_updated: t.last_updated,
          };
        });

        // Conta traduzioni aggiornate (badge verde), obsolete (arancione), mancanti (rosso)
        let translatedCount = 0;
        let outdatedCount = 0; // badge arancione
        let missingCount = 0; // badge rosso
        const debugUntranslated: Array<{ entityType: string; id: string; field: string; status: "missing" | "outdated"; value: string }> = [];

        for (const f of fieldsToCheck) {
          const lookupKey = `${f.entityType}:${f.id}:${f.field}`;
          const translation = translationsMap[lookupKey];
          if (!translation) {
            // Manca del tutto (badge rosso)
            missingCount++;
            debugUntranslated.push({ ...f, status: "missing" });
            continue;
          }
          // Check outdated: se la traduzione esiste ma è più vecchia dell'originale
          const originalUpdated = f.updated_at ? new Date(f.updated_at).getTime() : 0;
          const translationUpdated = translation.last_updated ? new Date(translation.last_updated).getTime() : 0;
          if (translationUpdated < originalUpdated) {
            // Traduzione obsoleta (badge arancione)
            outdatedCount++;
            debugUntranslated.push({ ...f, status: "outdated" });
          } else {
            // Traduzione aggiornata (badge verde)
            translatedCount++;
          }
        }

        const untranslatedCount = missingCount + outdatedCount;
        const percentage = totalFields > 0 ? Math.round((translatedCount / totalFields) * 100) : 0;

        setStats({
          total: totalFields,
          translated: translatedCount,
          untranslated: untranslatedCount,
          percentage
        });

        // DEBUG: Mostra in console i campi non ancora tradotti secondo la nuova definizione (badge arancione/rosso)
        if (debugUntranslated.length > 0) {
          console.log(
            "[STATISTICHE MULTILINGUA][DEBUG] Campi ancora da tradurre/aggiornare (badge rosso+arancione) secondo progress bar:",
            debugUntranslated
          );
        } else {
          console.log("[STATISTICHE MULTILINGUA][DEBUG] Tutti i campi sono tradotti ed aggiornati (nessun badge arancione/rosso nella progress bar).");
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
