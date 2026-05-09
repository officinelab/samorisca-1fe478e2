
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SupportedLanguage } from "@/types/translation";

export type EntityType = "categories" | "products" | "allergens" | "product_features" | "product_labels" | "category_notes";
export interface MissingOrOutdatedField {
  id: string;
  entityType: EntityType;
  name: string;
  field: string;
  badge: "missing" | "outdated";
}

const translatableFields: Record<EntityType, string[]> = {
  categories: ["title", "description"],
  products: ["title", "description", "price_suffix", "price_variant_1_name", "price_variant_2_name"],
  allergens: ["title", "description"],
  product_features: ["title"],
  product_labels: ["title"],
  category_notes: ["title", "text"],
};

const principalFields: Record<EntityType, string[]> = {
  products: [
    "title", "description", "price_suffix",
    "price_variant_1_name", "price_variant_2_name"
  ],
  categories: ["title", "description"],
  allergens: ["title", "description"],
  product_features: ["title"],
  product_labels: ["title"],
  category_notes: ["title", "text"],
};

export const useMissingTranslations = (language: SupportedLanguage) => {
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
          entityType === "product_labels" ||
          entityType === "category_notes"
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

        for (const e of entities as any[]) {
          entitiesById[`${entityType}:${e.id}`] = e;
        }

        const idsArray = (entities as any[]).map(e => e.id);
        if (!idsArray.length) continue;

        const { data: translationRows } = await supabase
          .from("translations")
          .select("entity_id,field,last_updated,original_text")
          .eq("entity_type", entityType)
          .eq("language", language)
          .in("entity_id", idsArray);

        const translationsMap: Record<string, Record<string, { last_updated: string; original_text: string | null }>> = {};
        if (translationRows) {
          for (const t of translationRows) {
            if (!translationsMap[t.entity_id]) translationsMap[t.entity_id] = {};
            translationsMap[t.entity_id][t.field] = {
              last_updated: t.last_updated,
              original_text: (t as any).original_text ?? null,
            };
          }
        }

        for (const entity of entities as any[]) {
          for (const field of translatableFields[entityType]) {
            if (
              !entity[field] ||
              typeof entity[field] !== "string" ||
              entity[field].trim() === ""
            ) {
              continue;
            }
            let status: "missing" | "outdated" | null = null;

            const trans = translationsMap[entity.id]?.[field];

            if (!trans) {
              status = "missing";
            } else if (trans.original_text != null) {
              // Preferred: compare source text vs stored original_text
              const current = typeof entity[field] === "string" ? entity[field] : "";
              if (current.trim() !== String(trans.original_text).trim()) {
                status = "outdated";
              }
            } else {
              // Fallback (legacy rows without original_text): timestamp comparison
              const entityUpdatedAt = entity.updated_at ? new Date(entity.updated_at).getTime() : 0;
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

    // 👂 Listen to refresh-translation-status
    const onRefresh = () => {
      if (!cancelled) fetchAll();
    };
    window.addEventListener("refresh-translation-status", onRefresh);

    return () => { 
      cancelled = true;
      window.removeEventListener("refresh-translation-status", onRefresh);
    };
  }, [language]);

  return { fieldsToTranslate, isLoading, entitiesMap };
};
