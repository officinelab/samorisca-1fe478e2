
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrintLayout } from "@/types/printLayout";
import { useLayoutEditor } from "./editor/useLayoutEditor";
import GeneralTab from "./editor/GeneralTab";
import ElementsTab from "./editor/ElementsTab";
import SpacingTab from "./editor/SpacingTab";
import PageSettingsTab from "./editor/PageSettingsTab";

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
          <TabsList className="mb-4">
            <TabsTrigger value="generale">Generale</TabsTrigger>
            <TabsTrigger value="elementi">Elementi</TabsTrigger>
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
