import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { SupportedLanguage } from "@/types/translation";
import { TranslationField } from "./TranslationField";

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

const entityFriendlyLabels: Record<EntityType, string> = {
  categories: "Categorie",
  products: "Prodotti",
  allergens: "Allergeni",
  product_features: "Caratteristiche",
  product_labels: "Etichette",
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
        selectFields.push(...translatableFields[entityType]);

        const { data: entities, error: entitiesError } = await supabase
          .from(entityType)
          .select(selectFields.join(", "));

        if (entitiesError || !entities) continue;

        // Index entities by id for quick lookup later
        for (const e of entities as any[]) {
          entitiesById[`${entityType}:${e.id}`] = e;
        }

        // Carica tutte le traduzioni per questi entity records in batch
        const idsArray = (entities as any[]).map(e => e.id);
        if (!idsArray.length) continue;

        const { data: translationRows, error: translationsError } = await supabase
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
            if (!entity[field] || typeof entity[field] !== "string" || entity[field].trim() === "") continue;
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

  // Raggruppa per entityType per la visualizzazione
  const grouped: Record<string, MissingOrOutdatedField[]> = {};
  for (const entry of fieldsToTranslate) {
    if (!grouped[entry.entityType]) grouped[entry.entityType] = [];
    grouped[entry.entityType].push(entry);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="font-semibold text-xl mb-4">
          Voci da tradurre/aggiornare ({fieldsToTranslate.length})
        </h2>
        <div className="space-y-6">
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : fieldsToTranslate.length === 0 ? (
            <div className="text-green-600 text-center py-8 font-medium">
              Complimenti! Tutte le voci sono tradotte e aggiornate in questa lingua.
            </div>
          ) : (
            Object.entries(grouped).map(([entityType, list]) => (
              <div key={entityType} className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  {entityFriendlyLabels[entityType as EntityType]}
                </h3>
                <div className="divide-y border rounded bg-muted">
                  {list.map(entry => {
                    const entityKey = `${entry.entityType}:${entry.id}`;
                    const entity = entitiesMap[entityKey];

                    return (
                      <div key={entry.id + "_" + entry.field} className="flex flex-col px-4 py-3 gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="max-w-sm flex-1 pr-4 min-w-0">
                          <div className="truncate font-medium">{entry.name}</div>
                          <div className="text-xs text-gray-500 truncate">({entry.id})</div>
                          <div className="mt-1 text-xs text-gray-600">
                            Campo: <span className="font-mono">{entry.field}</span>
                          </div>
                        </div>
                        <div className="sm:w-[55%] mt-2 sm:mt-0">
                          {entity && (
                            <TranslationField
                              id={entry.id}
                              entityType={entry.entityType}
                              fieldName={entry.field}
                              originalText={entity[entry.field] || ""}
                              language={language}
                              multiline={["description"].includes(entry.field)}
                              // mostriamo la notifica anche dopo salvataggio
                              onTranslationSaved={() => {}}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
