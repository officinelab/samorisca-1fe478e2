import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SupportedLanguage } from "@/types/translation";
import { TableTranslationLayout } from "./TableTranslationLayout";
import { entityFriendlyLabels } from "./entityFriendlyLabels"; // nuovo file helper
import { Badge } from "@/components/ui/badge";

// Definizione tipi
type EntityType = "categories" | "products" | "allergens" | "product_features" | "product_labels";
interface MissingOrOutdatedField {
  id: string;
  entityType: EntityType;
  name: string;
  field: string;
  badge: "missing" | "outdated";
}
interface MissingTranslationsTabProps {
  language: SupportedLanguage;
}

const translatableFields: Record<EntityType, string[]> = {
  categories: ["title", "description"],
  products: ["title", "description", "price_suffix", "price_variant_1_name", "price_variant_2_name"],
  allergens: ["title", "description"],
  product_features: ["title"],
  product_labels: ["title"],
};
// In questa tab NON mostriamo campi prezzo!
const principalFields: Record<EntityType, string[]> = {
  products: [
    "title", "description", "price_suffix",
    "price_variant_1_name", "price_variant_2_name"
    // NIENTE campi prezzo qui
  ],
  categories: ["title", "description"],
  allergens: ["title", "description"],
  product_features: ["title"],
  product_labels: ["title"],
};
const fieldLabels: Record<string, string> = {
  title: "Nome",
  description: "Descrizione",
  price_suffix: "Suffisso prezzo",
  price_variant_1_name: "Variante 1 nome",
  price_variant_2_name: "Variante 2 nome"
  // Nessun label per campi prezzo qui!
};

export const MissingTranslationsTab = ({ language }: MissingTranslationsTabProps) => {
  const [fieldsToTranslate, setFieldsToTranslate] = useState<MissingOrOutdatedField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [entitiesMap, setEntitiesMap] = useState<Record<string, any>>({});

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    async function fetchAll() {
      let results: MissingOrOutdatedField[] = [];
      let entitiesById: Record<string, any> = {};

      for (const entityType of Object.keys(translatableFields) as EntityType[]) {
        let selectFields = ["id", "updated_at"];
        if (
          entityType === "products" ||
          entityType === "categories" ||
          entityType === "allergens" ||
          entityType === "product_features" ||
          entityType === "product_labels"
        ) {
          selectFields.push("title");
        }
        // Solo i campi traducibili (escludiamo ogni campo prezzo da select)
        selectFields.push(...Array.from(new Set([
          ...(principalFields[entityType] || []),
          ...translatableFields[entityType]
        ])));

        const { data: entities, error: entitiesError } = await supabase
          .from(entityType)
          .select(selectFields.join(", "));

        if (entitiesError || !entities) continue;

        for (const e of entities as any[]) {
          entitiesById[`${entityType}:${e.id}`] = e;
        }

        const idsArray = (entities as any[]).map(e => e.id);
        if (!idsArray.length) continue;

        const { data: translationRows } = await supabase
          .from("translations")
          .select("entity_id,field,last_updated")
          .eq("entity_type", entityType)
          .eq("language", language)
          .in("entity_id", idsArray);

        const translationsMap: Record<string, Record<string, { last_updated: string }>> = {};
        if (translationRows) {
          for (const t of translationRows) {
            if (!translationsMap[t.entity_id]) translationsMap[t.entity_id] = {};
            translationsMap[t.entity_id][t.field] = { last_updated: t.last_updated };
          }
        }

        for (const entity of entities as any[]) {
          for (const field of translatableFields[entityType]) {
            // Manteniamo SOLO i campi traducibili CON valore! (Mai i prezzi)
            if (
              !entity[field] ||
              typeof entity[field] !== "string" ||
              entity[field].trim() === ""
            ) {
              continue;
            }
            let status: "missing" | "outdated" | null = null;

            const entityUpdatedAt = entity.updated_at ? new Date(entity.updated_at).getTime() : 0;
            const trans = translationsMap[entity.id]?.[field];

            if (!trans) {
              status = "missing";
            } else {
              const translationDate = trans.last_updated ? new Date(trans.last_updated).getTime() : 0;
              if (translationDate < entityUpdatedAt) status = "outdated";
            }
            if (status) {
              results.push({
                id: entity.id,
                entityType,
                name: entity.title || "(senza titolo)",
                field,
                badge: status,
              });
            }
          }
        }
      }

      if (!cancelled) {
        setEntitiesMap(entitiesById);
        setFieldsToTranslate(results);
        setIsLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [language]);

  // Raggruppamento come prima
  type GroupedEntries = { [entityKey:string]: { entityType: EntityType, id: string, fields: MissingOrOutdatedField[] } };
  const grouped: GroupedEntries = {};
  for (const entry of fieldsToTranslate) {
    const k = `${entry.entityType}:${entry.id}`;
    if (!grouped[k]) grouped[k] = { entityType: entry.entityType, id: entry.id, fields: [] };
    grouped[k].fields.push(entry);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="font-semibold text-xl mb-4">
          Voci da tradurre/aggiornare ({fieldsToTranslate.length})
        </h2>
        <div className="space-y-7">
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : fieldsToTranslate.length === 0 ? (
            <div className="text-green-600 text-center py-8 font-medium">
              Complimenti! Tutte le voci sono tradotte e aggiornate in questa lingua.
            </div>
          ) : (
            Object.entries(grouped).map(([entityKey, group]) => {
              const entity = entitiesMap[entityKey];
              if (!entity) return null;
              const { entityType, fields } = group;
              // Preparo config righe
              const toBeTranslatedFields = fields.map(f => f.field);
              const badgeMap = Object.fromEntries(fields.map(f => [f.field, f.badge]));
              // Mostra solo i campi originali che hanno valore non vuoto
              const rows = principalFields[entityType]
                // FILTRO: solo campi traducibili con valore (mai campi prezzo)
                .filter(fieldName =>
                  translatableFields[entityType].includes(fieldName) && // Solo campi traducibili
                  entity[fieldName] !== undefined &&
                  entity[fieldName] !== null &&
                  (typeof entity[fieldName] !== "string" || entity[fieldName].trim() !== "")
                )
                .map(fieldName => ({
                  label: fieldLabels[fieldName] ?? fieldName,
                  fieldName,
                  original: entity[fieldName] !== undefined && entity[fieldName] !== null ? String(entity[fieldName]) : "",
                  translationField: true, // sono sempre traducibili in questa tab
                  multiline: fieldName === "description",
                  isMissing: toBeTranslatedFields.includes(fieldName),
                  badgeType: badgeMap[fieldName],
                }));
              // Se non ci sono campi da mostrare salta
              if (rows.length === 0) return null;
              return (
                <TableTranslationLayout
                  key={entityKey}
                  title={entity.title || "(senza titolo)"}
                  subtitle={entity.description || ""}
                  rows={rows}
                  language={language}
                  entityType={entityType}
                  entityId={entity.id}
                />
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
