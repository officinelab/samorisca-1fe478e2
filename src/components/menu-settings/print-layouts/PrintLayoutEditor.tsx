
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save size={22} className="text-primary" />
          Modifica layout: <span className="ml-1 font-normal text-muted-foreground">{editedLayout.name}</span>
        </CardTitle>
        <CardDescription>
          Personalizza tutti gli aspetti del layout selezionato.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        {/* Tabs verticali su desktop, orizzontali su mobile */}
        <div className="flex flex-col md:flex-row gap-6">
          <Tabs
            orientation="vertical"
            value={activeTab}
            onValueChange={setActiveTab}
            className="md:w-44 md:min-w-44"
          >
            <TabsList className="flex md:flex-col md:gap-1">
              <TabsTrigger value="generale">Generale</TabsTrigger>
              <TabsTrigger value="elementi">Elementi Menu</TabsTrigger>
              <TabsTrigger value="copertina">Copertina</TabsTrigger>
              <TabsTrigger value="allergeni">Allergeni</TabsTrigger>
              <TabsTrigger value="spaziatura">Spaziatura</TabsTrigger>
              <TabsTrigger value="pagina">Impostazioni Pagina</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex-1">
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
          </div>
        </div>

        <Separator className="my-6" />
        <div className="flex justify-end flex-col items-end">
          {validationError && (
            <span className="text-sm text-red-500 mb-2">{validationError}</span>
          )}
          <Button onClick={handleSaveWithValidation}>
            <Save size={18} className="mr-2" /> Salva modifiche
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrintLayoutEditor;
