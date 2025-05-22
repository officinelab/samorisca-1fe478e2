
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { SupportedLanguage } from "@/types/translation";

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

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    async function fetchAll() {
      let results: MissingOrOutdatedField[] = [];

      for (const entityType of Object.keys(translatableFields) as EntityType[]) {
        // 1. Carica tutte le entità (+ id, titolo, updated_at, fields)
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

        // 2. Carica tutte le traduzioni di queste entities in UNA SOLA QUERY
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

        // 3. Individua i campi mancanti o da aggiornare (rosso/arancione)
        for (const entity of entities as any[]) {
          for (const field of translatableFields[entityType]) {
            // Calcola solo dove il campo di origine ha valore
            if (!entity[field] || typeof entity[field] !== "string" || entity[field].trim() === "") continue;
            let status: "missing" | "outdated" | null = null;

            const entityUpdatedAt = entity.updated_at ? new Date(entity.updated_at).getTime() : 0;
            const trans = translationsMap[entity.id]?.[field];

            if (!trans) {
              status = "missing"; // badge rosso
            } else {
              const translationDate = trans.last_updated ? new Date(trans.last_updated).getTime() : 0;
              if (translationDate < entityUpdatedAt) status = "outdated"; // badge arancione
            }
            // mostra solo rosso/arancione
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
                  {list.map(entry => (
                    <div
                      key={entry.id + "_" + entry.field}
                      className="flex items-center px-4 py-2 justify-between"
                    >
                      <div>
                        <span className="font-medium">{entry.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({entry.id})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{entry.field}</Badge>
                        {entry.badge === "missing" ? (
                          <span title="Traduzione mancante" className="ml-2 text-red-600">
                            ●
                          </span>
                        ) : (
                          <span title="Traduzione da aggiornare" className="ml-2 text-amber-500">
                            ●
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
