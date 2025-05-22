
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { SupportedLanguage } from "@/types/translation";
import { TranslationField } from "./TranslationField";
import { cn } from "@/lib/utils";

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

const principalFields: Record<EntityType, string[]> = {
  products: [
    "title", "description", "price_standard", "price_suffix",
    "price_variant_1_name", "price_variant_1_value", "price_variant_2_name", "price_variant_2_value"
  ],
  categories: ["title", "description"],
  allergens: ["title", "description"],
  product_features: ["title"],
  product_labels: ["title"],
};

const entityFriendlyLabels: Record<EntityType, string> = {
  categories: "Categoria",
  products: "Prodotto",
  allergens: "Allergene",
  product_features: "Caratteristica",
  product_labels: "Etichetta",
};

// Visualizza i campi principali in italiano (sinistra)
function EntityOriginalFields({ entityType, entity }:{
  entityType: EntityType,
  entity: any
}) {
  const fieldLabels:Record<string,string> = {
    title: "Nome",
    description: "Descrizione",
    price_standard: "Prezzo standard",
    price_suffix: "Suffisso prezzo",
    price_variant_1_name: "Variante 1 nome",
    price_variant_1_value: "Variante 1 prezzo",
    price_variant_2_name: "Variante 2 nome",
    price_variant_2_value: "Variante 2 prezzo"
  };
  const fields = principalFields[entityType];
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground font-semibold mb-1">Originale (Italiano)</div>
      {fields.map(field => (
        <div key={field} className="text-xs px-1 py-0.5 break-all">
          <span className="font-medium">{fieldLabels[field] ?? field}: </span>
          <span className="text-gray-900">
            {entity && entity[field] !== undefined && entity[field] !== null && String(entity[field]).trim() !== ""
              ? String(entity[field])
              : <span className="italic text-gray-400">--</span>
            }
          </span>
        </div>
      ))}
    </div>
  );
}

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
        selectFields.push(...Array.from(new Set([
          ...(principalFields[entityType] || []),
          ...translatableFields[entityType]
        ])));

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

  // Raggruppa i fields da tradurre per record (id+entityType)
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
        <div className="space-y-6">
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
              return (
                <div
                  key={entityKey}
                  className="border rounded-lg bg-white/90 dark:bg-muted/60 p-3 my-2 shadow-sm flex flex-col sm:flex-row gap-4"
                >
                  <div className="flex-1 min-w-[220px] max-w-xs">
                    {/* Header: tipo + nome */}
                    <div className="font-medium text-sm text-gray-700 flex items-center gap-1 mb-2">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 mr-1 text-xs">{entityFriendlyLabels[entityType]}</span>
                      <span className="truncate">{entity.title || "(senza titolo)"}</span>
                      <span className="text-gray-400 text-xs ml-2">({entity.id})</span>
                    </div>
                    <EntityOriginalFields entityType={entityType} entity={entity} />
                  </div>
                  <div className="sm:flex-1 flex flex-col gap-2">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">
                      Traduzione in {language}
                    </div>
                    {/* Lista campi */}
                    <div className="flex flex-col gap-2">
                      {translatableFields[entityType].map(fieldName => {
                        // Cerchiamo se per questo campo serve la traduzione o solo riferimento:
                        const missingEntry = fields.find(f => f.field === fieldName);
                        if (missingEntry) {
                          // Serve traduzione (manca o da aggiornare)
                          return (
                            <div key={fieldName} className={cn(
                              "flex flex-col gap-1 border rounded px-2 py-1 bg-orange-50/40",
                              "shadow-inner border-orange-300"
                            )}>
                              <div className="flex items-center justify-between">
                                <div className="text-xs font-medium">{fieldName}</div>
                                <Badge variant={missingEntry.badge === "missing" ? "destructive" : "secondary"}>
                                  {missingEntry.badge === "missing" ? "Manca traduzione" : "Da aggiornare"}
                                </Badge>
                              </div>
                              <TranslationField
                                id={entity.id}
                                entityType={entityType}
                                fieldName={fieldName}
                                originalText={entity[fieldName] || ""}
                                language={language}
                                multiline={["description"].includes(fieldName)}
                                onTranslationSaved={() => {}}
                              />
                            </div>
                          );
                        }
                        // Solo riferimento (presentiamo il campo ma non c’è bisogno di traduzione)
                        return (
                          <div key={fieldName} className="flex items-center text-xs px-2 py-1 text-muted-foreground">
                            <span className="font-medium">{fieldName}: </span>
                            <span className="ml-2 italic">
                              {entity[fieldName] && String(entity[fieldName]).trim() !== ""
                                ? String(entity[fieldName])
                                : "--"
                              }
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
