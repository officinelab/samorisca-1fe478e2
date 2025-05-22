
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SupportedLanguage } from "@/types/translation";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type MissingField = { field: string; label: string };

type TranslatableEntity = {
  id: string;
  mainLabel: string;
  entityType: string;
  fields: MissingField[];
};

interface MissingTranslationsTabProps {
  language: SupportedLanguage;
}

const ENTITY_DEFS = [
  {
    type: "categories",
    label: "Categorie",
    idField: "id",
    titleField: "title",
    fields: [
      { db: "title", label: "Titolo" },
      { db: "description", label: "Descrizione" }
    ]
  },
  {
    type: "products",
    label: "Prodotti",
    idField: "id",
    titleField: "title",
    fields: [
      { db: "title", label: "Titolo" },
      { db: "description", label: "Descrizione" }
    ]
  },
  {
    type: "allergens",
    label: "Allergeni",
    idField: "id",
    titleField: "title",
    fields: [
      { db: "title", label: "Nome" },
      { db: "description", label: "Descrizione" }
    ]
  },
  {
    type: "product_features",
    label: "Caratteristiche",
    idField: "id",
    titleField: "title",
    fields: [
      { db: "title", label: "Nome" }
    ]
  },
  {
    type: "product_labels",
    label: "Etichette",
    idField: "id",
    titleField: "title",
    fields: [
      { db: "title", label: "Nome" }
    ]
  }
];

export const MissingTranslationsTab = ({ language }: MissingTranslationsTabProps) => {
  const [loading, setLoading] = useState(true);
  const [entities, setEntities] = useState<Record<string, TranslatableEntity[]>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setEntities({});
    setError(null);

    const fetchMissingTranslations = async () => {
      try {
        // Recupera tutte le traduzioni per lingua
        const { data: translations, error: tErr } = await supabase
          .from("translations")
          .select("entity_id, entity_type, field")
          .eq("language", language);

        if (tErr) throw tErr;

        // Crea rapidamente una lookup: { [entity_type]: { [entity_id]: Set(fields tradotti) } }
        const translatedLookup: Record<string, Record<string, Set<string>>> = {};
        for (const tr of translations || []) {
          if (!translatedLookup[tr.entity_type]) translatedLookup[tr.entity_type] = {};
          if (!translatedLookup[tr.entity_type][tr.entity_id]) translatedLookup[tr.entity_type][tr.entity_id] = new Set();
          translatedLookup[tr.entity_type][tr.entity_id].add(tr.field);
        }

        // Per ogni entità, trova voci con almeno un campo mancante
        const result: Record<string, TranslatableEntity[]> = {};

        for (const def of ENTITY_DEFS) {
          // Carica tutte le voci base per l'entità
          const { data, error: dataError } = await supabase
            .from(def.type)
            .select(`${def.idField}, ${def.titleField}`)
            .order(def.titleField, { ascending: true });

          if (dataError) throw dataError;
          if (!data) continue;

          const ents: TranslatableEntity[] = [];
          for (const row of data) {
            const missingFields: MissingField[] = [];
            const entityTranslations = translatedLookup[def.type]?.[row[def.idField]] || new Set();
            for (const f of def.fields) {
              if (!entityTranslations.has(f.db)) {
                missingFields.push({ field: f.db, label: f.label });
              }
            }
            if (missingFields.length > 0) {
              ents.push({
                id: row[def.idField],
                mainLabel: row[def.titleField] || "(senza titolo)",
                entityType: def.type,
                fields: missingFields
              });
            }
          }
          result[def.type] = ents;
        }

        if (isMounted) {
          setEntities(result);
        }
      } catch (err: any) {
        setError("Errore durante il caricamento delle voci da tradurre.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMissingTranslations();

    return () => {
      isMounted = false;
    };
  }, [language]);

  if (loading) {
    return <Skeleton className="h-[40vh] w-full" />;
  }
  if (error) {
    return <div className="text-destructive text-center p-4">{error}</div>;
  }

  const nothingToTranslate = Object.values(entities).every((arr) => arr.length === 0);

  return (
    <div className="w-full">
      {nothingToTranslate ? (
        <div className="text-center p-6 text-green-700 font-medium">Tutte le voci sono tradotte per questa lingua 🎉</div>
      ) : (
        <div className="flex flex-col gap-8 w-full">
          {ENTITY_DEFS.map((def) => (
            entities[def.type] && entities[def.type].length > 0 && (
              <div key={def.type} className="w-full">
                <h2 className="text-lg font-semibold mb-2">{def.label}</h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Campi mancanti</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entities[def.type].map((ent) => (
                        <TableRow key={ent.id}>
                          <TableCell className="font-medium">{ent.mainLabel}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {ent.fields.map((f) => (
                                <Badge key={f.field} variant="secondary" className="mr-2 mb-1">{f.label}</Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};
