
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupportedLanguage } from "@/types/translation";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

// Definizione dei tipi stringa delle sorgenti e dei campi traducibili
type EntityType = "categories" | "products" | "allergens" | "product_features" | "product_labels";

interface MissingFieldEntry {
  id: string;
  entityType: EntityType;
  name: string;          // Titolo principale dell'entità per riconoscimento visivo
  field: string;
}

interface MissingTranslationsTabProps {
  language: SupportedLanguage;
}

// Quali campi vanno controllati per ogni entità
const translatableFields: Record<EntityType, string[]> = {
  categories: ["title", "description"],
  products: ["title", "description", "price_suffix", "price_variant_1_name", "price_variant_2_name"],
  allergens: ["title", "description"],
  product_features: ["title"],
  product_labels: ["title"],
};

export const MissingTranslationsTab = ({ language }: MissingTranslationsTabProps) => {
  const [missingTranslations, setMissingTranslations] = useState<MissingFieldEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Testo user-friendly dei tipi
  const entityFriendlyLabels: Record<EntityType, string> = {
    categories: "Categorie",
    products: "Prodotti",
    allergens: "Allergeni",
    product_features: "Caratteristiche",
    product_labels: "Etichette",
  };

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    async function fetchMissingTranslations() {
      let allMissings: MissingFieldEntry[] = [];
      // Cicla ogni tipo di entità e cerca i record mancanti in translations per ogni campo traducibile
      for (const entityType of Object.keys(translatableFields) as EntityType[]) {
        // Recupera le entità di base con l'id e il campo "name/titolo"
        let selectFields = ["id"];
        // Scegli un campo di visualizzazione (preferibilmente titolo)
        if (entityType === "products" || entityType === "categories" || entityType === "allergens" || entityType === "product_features" || entityType === "product_labels") {
          selectFields.push("title");
        }
        // Aggiungi i campi che potrebbero essere da tradurre e sono effettivamente valorizzati
        selectFields.push(...translatableFields[entityType]);
        // Query al database
        const { data: entities, error } = await supabase
          .from(entityType)
          .select(selectFields.join(", "));

        if (error || !entities) continue;

        for (const entity of entities as any[]) {
          for (const field of translatableFields[entityType]) {
            // La traduzione serve solo se il valore di partenza esiste (campi opzionali, es: price_suffix, description)
            if (!entity[field] || typeof entity[field] !== "string" || entity[field].trim() === "") continue;

            // Verifica se la traduzione esiste già
            const { data: trans, error: transError } = await supabase
              .from("translations")
              .select("id")
              .eq("entity_id", entity.id)
              .eq("entity_type", entityType)
              .eq("field", field)
              .eq("language", language)
              .maybeSingle();

            if (!trans || transError) {
              // Mancante, da segnalare
              allMissings.push({
                id: entity.id,
                entityType,
                name: entity.title || "(senza titolo)",
                field,
              });
            }
          }
        }
      }

      if (!cancelled) {
        setMissingTranslations(allMissings);
        setIsLoading(false);
      }
    }

    fetchMissingTranslations();
    return () => { cancelled = true; };
  }, [language]);

  // Raggruppa per entità per la visualizzazione (Categorie, Prodotti, ecc)
  const groupedByType: Record<string, MissingFieldEntry[]> = {};
  for (const entry of missingTranslations) {
    if (!groupedByType[entry.entityType]) groupedByType[entry.entityType] = [];
    groupedByType[entry.entityType].push(entry);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="font-semibold text-xl mb-4">Voci da tradurre ({missingTranslations.length})</h2>
        <div className="space-y-6">
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : missingTranslations.length === 0 ? (
            <div className="text-green-600 text-center py-8 font-medium">
              Complimenti! Tutte le voci sono tradotte in questa lingua.
            </div>
          ) : (
            Object.entries(groupedByType).map(([entityType, list]) => (
              <div key={entityType}>
                <h3 className="text-lg font-semibold mb-2">{entityFriendlyLabels[entityType as EntityType]}</h3>
                <div className="divide-y border rounded bg-muted">
                  {list.map(entry => (
                    <div key={entry.id + "_" + entry.field} className="flex items-center px-4 py-2 justify-between">
                      <div>
                        <span className="font-medium">{entry.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({entry.id})</span>
                      </div>
                      <Badge variant="outline">{entry.field}</Badge>
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
