
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Loader2, Globe } from "lucide-react";
import { useMissingTranslations } from "./hooks/useMissingTranslations";
import { MissingTranslationGroup } from "./MissingTranslationGroup";
import { SupportedLanguage } from "@/types/translation";
import { useBatchTranslate, BatchJob, BatchEntityType } from "./hooks/useBatchTranslate";

interface MissingTranslationsTabProps {
  language: SupportedLanguage;
}

export const MissingTranslationsTab = ({ language }: MissingTranslationsTabProps) => {
  const { fieldsToTranslate, isLoading, entitiesMap } = useMissingTranslations(language);
  const { isTranslating, translateFields } = useBatchTranslate();

  // Raggruppamento come prima
  type GroupedEntries = { [entityKey:string]: { entityType: string, id: string, fields: { field: string; badge: "missing" | "outdated" }[] } };
  const grouped: GroupedEntries = {};
  for (const entry of fieldsToTranslate) {
    const k = `${entry.entityType}:${entry.id}`;
    if (!grouped[k]) grouped[k] = { entityType: entry.entityType, id: entry.id, fields: [] };
    grouped[k].fields.push({ field: entry.field, badge: entry.badge });
  }

  const handleTranslateAll = async () => {
    const jobs: BatchJob[] = [];
    for (const entry of fieldsToTranslate) {
      const entity = entitiesMap[`${entry.entityType}:${entry.id}`];
      const original = entity?.[entry.field];
      if (typeof original === "string" && original.trim()) {
        jobs.push({
          entityType: entry.entityType as BatchEntityType,
          entityId: entry.id,
          fieldName: entry.field,
          originalText: original,
        });
      }
    }
    await translateFields(jobs, language, {
      skipFreshnessCheck: true,
      label: "voci",
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-xl">
            Voci da tradurre/aggiornare ({fieldsToTranslate.length})
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTranslateAll}
            disabled={isTranslating || isLoading || fieldsToTranslate.length === 0}
            className="whitespace-nowrap"
          >
            {isTranslating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Traduzione...
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 mr-2" />
                Traduci tutto
              </>
            )}
          </Button>
        </div>
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
