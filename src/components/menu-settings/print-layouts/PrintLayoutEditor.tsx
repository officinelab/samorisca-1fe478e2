import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrintLayout } from "@/types/printLayout";
import { useLayoutEditor } from "./editor/useLayoutEditor";
import GeneralTab from "./editor/GeneralTab";
import ElementsTab from "./editor/ElementsTab";
import SpacingTab from "./editor/SpacingTab";
import PageSettingsTab from "./editor/PageSettingsTab";
import CoverLayoutTab from "./editor/CoverLayoutTab";
import AllergensLayoutTab from "./editor/AllergensLayoutTab";

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
    
    // Nuove funzioni per copertina
    handleCoverLogoChange,
    handleCoverTitleChange,
    handleCoverTitleMarginChange,
    handleCoverSubtitleChange,
    handleCoverSubtitleMarginChange,
    
    // Nuove funzioni per allergeni
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

  // Validazione margini e fontSize (step 8 minimal)
  const [validationError, setValidationError] = useState<string | null>(null);

  const validate = () => {
    // Margini
    const page = editedLayout.page;
    const allMargins = [
      page.marginTop, page.marginRight, page.marginBottom, page.marginLeft,
      ...(page.oddPages ? [page.oddPages.marginTop, page.oddPages.marginRight, page.oddPages.marginBottom, page.oddPages.marginLeft] : []),
      ...(page.evenPages ? [page.evenPages.marginTop, page.evenPages.marginRight, page.evenPages.marginBottom, page.evenPages.marginLeft] : [])
    ];
    // FontSize elementari
    const allFontSizes = [
      ...Object.values(editedLayout.elements).map(e => e.fontSize)
    ];
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
    if (validate()) handleSave();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modifica Layout: {editedLayout.name}</CardTitle>
        <CardDescription>
          Personalizza tutti gli aspetti del layout di stampa
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="generale">Generale</TabsTrigger>
            <TabsTrigger value="elementi">Elementi Menu</TabsTrigger>
            <TabsTrigger value="copertina">Copertina</TabsTrigger>
            <TabsTrigger value="allergeni">Allergeni</TabsTrigger>
            <TabsTrigger value="spaziatura">Spaziatura</TabsTrigger>
            <TabsTrigger value="pagina">Impostazioni Pagina</TabsTrigger>
          </TabsList>

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

        <div className="flex justify-end mt-6 flex-col items-end">
          {validationError && (
            <span className="text-sm text-red-500 mb-2">{validationError}</span>
          )}
          <Button onClick={handleSaveWithValidation}>Salva modifiche</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrintLayoutEditor;
