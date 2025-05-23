
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SupportedLanguage } from "@/types/translation";
import { EntityTypeSelector, entityOptions, EntityOption } from "./EntityTypeSelector";
import { TranslationsTable } from "./TranslationsTable";
import { useGeneralTranslationsData } from "./hooks/useGeneralTranslationsData";

interface GeneralTranslationsTabProps {
  language: SupportedLanguage;
}

export const GeneralTranslationsTab = ({ language }: GeneralTranslationsTabProps) => {
  const [selectedEntityType, setSelectedEntityType] = useState<EntityOption>(entityOptions[0]);
  const { items, loading } = useGeneralTranslationsData(selectedEntityType, language);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EntityTypeSelector
            selectedEntityType={selectedEntityType}
            onEntityTypeChange={setSelectedEntityType}
          />

          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-4">Traduzioni</h3>
            <TranslationsTable
              items={items}
              language={language}
              loading={loading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
