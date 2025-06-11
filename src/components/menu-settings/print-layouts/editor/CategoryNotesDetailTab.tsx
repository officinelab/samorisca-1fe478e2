
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PrintLayout, PrintLayoutElementConfig, CategoryNotesDetailConfig } from "@/types/printLayout";
import ElementEditor from "../ElementEditor";

interface CategoryNotesDetailTabProps {
  layout: PrintLayout;
  onCategoryNotesDetailIconChange: (field: 'size', value: number) => void;
  onCategoryNotesDetailTitleChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  onCategoryNotesDetailTitleMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  onCategoryNotesDetailTextChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  onCategoryNotesDetailTextMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
}

const CategoryNotesDetailTab: React.FC<CategoryNotesDetailTabProps> = ({
  layout,
  onCategoryNotesDetailIconChange,
  onCategoryNotesDetailTitleChange,
  onCategoryNotesDetailTitleMarginChange,
  onCategoryNotesDetailTextChange,
  onCategoryNotesDetailTextMarginChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Configurazione Note Categorie</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Configura l'aspetto delle note delle categorie nel menu di stampa.
        </p>
      </div>

      {/* Configurazione Icona */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Icona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Dimensione Icona (px)</label>
              <input
                type="number"
                value={layout.categoryNotesDetail?.icon?.size || 16}
                onChange={(e) => onCategoryNotesDetailIconChange('size', Number(e.target.value))}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                min="8"
                max="64"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Configurazione Titolo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Titolo</CardTitle>
        </CardHeader>
        <CardContent>
          <ElementEditor
            element={layout.categoryNotesDetail?.title || {
              fontFamily: "Arial",
              fontSize: 14,
              fontColor: "#000000",
              fontStyle: "bold",
              alignment: "left",
              margin: { top: 0, right: 8, bottom: 4, left: 0 }
            }}
            onChange={onCategoryNotesDetailTitleChange}
            onMarginChange={onCategoryNotesDetailTitleMarginChange}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Configurazione Testo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Testo</CardTitle>
        </CardHeader>
        <CardContent>
          <ElementEditor
            element={layout.categoryNotesDetail?.text || {
              fontFamily: "Arial",
              fontSize: 12,
              fontColor: "#666666",
              fontStyle: "normal",
              alignment: "left",
              margin: { top: 0, right: 0, bottom: 8, left: 0 }
            }}
            onChange={onCategoryNotesDetailTextChange}
            onMarginChange={onCategoryNotesDetailTextMarginChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryNotesDetailTab;
