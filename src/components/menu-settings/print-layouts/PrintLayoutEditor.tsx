
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrintLayout } from "@/types/printLayout";
import { useLayoutEditor } from "./editor/useLayoutEditor";
import GeneralTab from "./editor/GeneralTab";
import ElementsTab from "./editor/ElementsTab";
import SpacingTab from "./editor/SpacingTab";
import PageSettingsTab from "./editor/PageSettingsTab";
import CoverLayoutTab from "./editor/CoverLayoutTab";
import AllergensLayoutTab from "./editor/AllergensLayoutTab";
import { Save } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface PrintLayoutEditorProps {
  layout: PrintLayout;
  onSave: (layout: PrintLayout) => void;
}

const LABEL_MAP: Record<string, string> = {
  generale: "Impostazioni generali",
  elementi: "Elementi Menu",
  copertina: "Copertina",
  allergeni: "Allergeni",
  spaziatura: "Spaziatura",
  pagina: "Impostazioni Pagina"
};

const PrintLayoutEditor = ({ layout, onSave }: PrintLayoutEditorProps) => {
  const {
    editedLayout,
    activeTab,
    setActiveTab,
    handleGeneralChange,
    handleElementChange,
    handleElementMarginChange,
    handleSpacingChange,
    handlePageMarginChange,
    handleOddPageMarginChange,
    handleEvenPageMarginChange,
    handleToggleDistinctMargins,
    handleCoverLogoChange,
    handleCoverTitleChange,
    handleCoverTitleMarginChange,
    handleCoverSubtitleChange,
    handleCoverSubtitleMarginChange,
    handleAllergensTitleChange,
    handleAllergensTitleMarginChange,
    handleAllergensDescriptionChange,
    handleAllergensDescriptionMarginChange,
    handleAllergensItemNumberChange,
    handleAllergensItemNumberMarginChange,
    handleAllergensItemTitleChange,
    handleAllergensItemTitleMarginChange,
    handleAllergensItemChange,
    handleSave
  } = useLayoutEditor(layout, onSave);

  // Validazione margini e fontSize (user-friendly!)
  const [validationError, setValidationError] = useState<string | null>(null);

  const validate = () => {
    const page = editedLayout.page;
    const allMargins = [
      page.marginTop, page.marginRight, page.marginBottom, page.marginLeft,
      ...(page.oddPages ? [page.oddPages.marginTop, page.oddPages.marginRight, page.oddPages.marginBottom, page.oddPages.marginLeft] : []),
      ...(page.evenPages ? [page.evenPages.marginTop, page.evenPages.marginRight, page.evenPages.marginBottom, page.evenPages.marginLeft] : [])
    ];
    const allFontSizes = [...Object.values(editedLayout.elements).map(e => e.fontSize)];
    if (allMargins.some(m => m < 0)) {
      setValidationError("I margini devono essere >= 0");
      return false;
    }
    if (allFontSizes.some(f => f <= 0)) {
      setValidationError("Tutti i font devono essere > 0");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSaveWithValidation = () => {
    if (validate()) {
      handleSave();
      toast.success("Modifiche salvate!");
    }
  };

  return (
    <Card className="max-w-full">
      <CardHeader className="border-b bg-muted/30 rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Save size={22} className="text-primary" />
          <span className="text-lg font-semibold">
            Modifica layout
          </span>
          <span className="ml-2 font-normal text-sm text-muted-foreground truncate max-w-xs">{editedLayout.name}</span>
        </CardTitle>
        <CardDescription className="pt-1">
          Gestisci visibilità, stili o testo di ogni elemento del layout <span className="font-semibold">{editedLayout.name}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Sezione tabs verticale su desktop/tablet, orizzontale su mobile: ogni tab ben separato */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-6">
          {/* Tabs verticali */}
          <Tabs
            orientation="vertical"
            value={activeTab}
            onValueChange={setActiveTab}
            className="md:w-52 md:min-w-52"
          >
            <TabsList className="flex md:flex-col md:gap-2 overflow-auto">
              {Object.keys(LABEL_MAP).map((tabKey) => (
                <TabsTrigger key={tabKey} value={tabKey} className="justify-start text-left py-2 px-2">
                  {LABEL_MAP[tabKey]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          {/* CONTENUTO: campo editor vero e proprio */}
          <div className="flex-1 min-w-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="generale">
                <GeneralTab
                  layout={editedLayout}
                  onGeneralChange={handleGeneralChange}
                />
              </TabsContent>
              <TabsContent value="elementi">
                <ElementsTab
                  layout={editedLayout}
                  onElementChange={handleElementChange}
                  onElementMarginChange={handleElementMarginChange}
                />
              </TabsContent>
              <TabsContent value="copertina">
                <CoverLayoutTab
                  layout={editedLayout}
                  onCoverLogoChange={handleCoverLogoChange}
                  onCoverTitleChange={handleCoverTitleChange}
                  onCoverTitleMarginChange={handleCoverTitleMarginChange}
                  onCoverSubtitleChange={handleCoverSubtitleChange}
                  onCoverSubtitleMarginChange={handleCoverSubtitleMarginChange}
                />
              </TabsContent>
              <TabsContent value="allergeni">
                <AllergensLayoutTab
                  layout={editedLayout}
                  onAllergensTitleChange={handleAllergensTitleChange}
                  onAllergensTitleMarginChange={handleAllergensTitleMarginChange}
                  onAllergensDescriptionChange={handleAllergensDescriptionChange}
                  onAllergensDescriptionMarginChange={handleAllergensDescriptionMarginChange}
                  onAllergensItemNumberChange={handleAllergensItemNumberChange}
                  onAllergensItemNumberMarginChange={handleAllergensItemNumberMarginChange}
                  onAllergensItemTitleChange={handleAllergensItemTitleChange}
                  onAllergensItemTitleMarginChange={handleAllergensItemTitleMarginChange}
                  onAllergensItemChange={handleAllergensItemChange}
                />
              </TabsContent>
              <TabsContent value="spaziatura">
                <SpacingTab
                  layout={editedLayout}
                  onSpacingChange={handleSpacingChange}
                />
              </TabsContent>
              <TabsContent value="pagina">
                <PageSettingsTab
                  layout={editedLayout}
                  onPageMarginChange={handlePageMarginChange}
                  onOddPageMarginChange={handleOddPageMarginChange}
                  onEvenPageMarginChange={handleEvenPageMarginChange}
                  onToggleDistinctMargins={handleToggleDistinctMargins}
                />
              </TabsContent>
            </Tabs>
            <Separator className="my-6" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                {validationError && (
                  <span className="text-sm text-red-500">{validationError}</span>
                )}
              </div>
              <Button
                onClick={handleSaveWithValidation}
                className="w-full md:w-auto mt-3 md:mt-0"
                variant="primary"
              >
                <Save size={18} className="mr-2" />
                Salva modifiche
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrintLayoutEditor;
