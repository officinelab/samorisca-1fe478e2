
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMissingTranslations } from "./hooks/useMissingTranslations";
import { MissingTranslationGroup } from "./MissingTranslationGroup";
import { SupportedLanguage } from "@/types/translation";

interface MissingTranslationsTabProps {
  language: SupportedLanguage;
}

export const MissingTranslationsTab = ({ language }: MissingTranslationsTabProps) => {
  const { fieldsToTranslate, isLoading, entitiesMap } = useMissingTranslations(language);

  // Raggruppamento come prima
  type GroupedEntries = { [entityKey:string]: { entityType: string, id: string, fields: { field: string; badge: "missing" | "outdated" }[] } };
  const grouped: GroupedEntries = {};
  for (const entry of fieldsToTranslate) {
    const k = `${entry.entityType}:${entry.id}`;
    if (!grouped[k]) grouped[k] = { entityType: entry.entityType, id: entry.id, fields: [] };
    grouped[k].fields.push({ field: entry.field, badge: entry.badge });
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
            Object.entries(grouped).map(([entityKey, group]) => (
              <MissingTranslationGroup
                key={entityKey}
                groupKey={entityKey}
                entity={entitiesMap[entityKey]}
                entityType={group.entityType}
                fields={group.fields}
                language={language}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
