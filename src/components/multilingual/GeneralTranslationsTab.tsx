
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Globe } from "lucide-react";
import { SupportedLanguage } from "@/types/translation";
import { EntityTypeSelector, entityOptions, EntityOption } from "./EntityTypeSelector";
import { TranslationsTable } from "./TranslationsTable";
import { useGeneralTranslationsData } from "./hooks/useGeneralTranslationsData";
import { useBatchTranslate, BatchJob } from "./hooks/useBatchTranslate";
import { BatchTranslateDialog } from "./BatchTranslateDialog";

interface GeneralTranslationsTabProps {
  language: SupportedLanguage;
}

export const GeneralTranslationsTab = ({ language }: GeneralTranslationsTabProps) => {
  const [selectedEntityType, setSelectedEntityType] = useState<EntityOption>(entityOptions[0]);
  const { items, loading } = useGeneralTranslationsData(selectedEntityType, language);
  const batch = useBatchTranslate();

  const handleTranslateAll = async () => {
    const jobs: BatchJob[] = [];
    for (const item of items) {
      if (item.title && item.title.trim()) {
        jobs.push({
          entityType: item.type,
          entityId: item.id,
          fieldName: "title",
          originalText: item.title,
        });
      }
      if (item.description && item.description.trim()) {
        jobs.push({
          entityType: item.type,
          entityId: item.id,
          fieldName: "description",
          originalText: item.description,
        });
      }
      if (item.type === "category_notes" && item.text && item.text.trim()) {
        jobs.push({
          entityType: item.type,
          entityId: item.id,
          fieldName: "text",
          originalText: item.text,
        });
      }
    }
    await batch.prepare(jobs, language, { label: "campi" });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EntityTypeSelector
            selectedEntityType={selectedEntityType}
            onEntityTypeChange={setSelectedEntityType}
          />

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Traduzioni</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTranslateAll}
                disabled={batch.isTranslating || loading || items.length === 0}
                className="whitespace-nowrap"
              >
                {batch.isTranslating ? (
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
            <TranslationsTable
              items={items}
              language={language}
              loading={loading}
            />
          </div>
        </div>
      </CardContent>
      <BatchTranslateDialog
        open={batch.open}
        onOpenChange={batch.setOpen}
        phase={batch.phase}
        totalJobs={batch.totalJobs}
        tokensRemaining={batch.tokensRemaining}
        progress={batch.progress}
        label={batch.label}
        onConfirm={batch.confirm}
        onAbort={batch.abort}
        onClose={batch.close}
      />
    </Card>
  );
};
