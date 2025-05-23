
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SupportedLanguage } from "@/types/translation";

interface EntityOption {
  value: string;
  label: string;
  type: 'categories' | 'allergens' | 'product_features' | 'product_labels';
}

interface TranslatableItem {
  id: string;
  title: string;
  description?: string | null;
  type: "categories" | "allergens" | "product_features" | "product_labels";
  translationTitle?: string;
  translationDescription?: string | null;
}

export const useGeneralTranslationsData = (
  selectedEntityType: EntityOption,
  language: SupportedLanguage
) => {
  const [items, setItems] = useState<TranslatableItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        // recupera sempre tutti i dati madre ORIGINALI
        let selectString = "id, title";
        if (selectedEntityType.type === "categories" || selectedEntityType.type === "allergens") {
          selectString += ", description";
        }
        let query = supabase.from(selectedEntityType.type).select(selectString);
        if (
          selectedEntityType.type === "categories" ||
          selectedEntityType.type === "allergens" ||
          selectedEntityType.type === "product_features" ||
          selectedEntityType.type === "product_labels"
        ) {
          query = query.order("display_order", { ascending: true });
        }
        const { data, error } = await query;
        if (error) throw error;

        // Se la lingua selezionata NON è italiano cerca le traduzioni, ma NON sovrascrive la colonna originale!
        let translationsMap: Record<string, Record<string, string>> = {};
        if (data.length > 0) {
          const { data: trans } = await supabase
            .from("translations")
            .select("*")
            .in("entity_id", data.map((it: any) => it.id))
            .eq("entity_type", selectedEntityType.type)
            .eq("language", language);

          (trans || []).forEach((tr: any) => {
            if (!translationsMap[tr.entity_id]) translationsMap[tr.entity_id] = {};
            translationsMap[tr.entity_id][tr.field] = tr.translated_text;
          });
        }

        // Mappa: colonna originale = italiano, campo tradotto separato
        setItems(
          (data || []).map((item: any) => ({
            id: item.id,
            title: item.title ?? "",
            description: item.description !== undefined ? item.description : null,
            type: selectedEntityType.type,
            translationTitle: translationsMap[item.id]?.title ?? "",
            translationDescription: translationsMap[item.id]?.description ?? "",
          }))
        );
      } catch (error) {
        console.error(`Error fetching ${selectedEntityType.label}:`, error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedEntityType, language]);

  return { items, loading };
};
