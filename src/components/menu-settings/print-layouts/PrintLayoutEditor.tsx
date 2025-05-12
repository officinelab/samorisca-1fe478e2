
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrintLayout } from "@/types/printLayout";
import { useLayoutEditor } from "./editor/useLayoutEditor"; // Fix the import path to use the correct hook
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
    handleMenuTitleChange,
    handleMenuSubtitleChange,
    
    // Funzioni per allergeni
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
              onMenuTitleChange={handleMenuTitleChange}
              onMenuSubtitleChange={handleMenuSubtitleChange}
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

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>Salva modifiche</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrintLayoutEditor;
