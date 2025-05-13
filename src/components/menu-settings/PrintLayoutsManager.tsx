
import { useState } from "react";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import PrintLayoutsList from "./print-layouts/PrintLayoutsList";
import PrintLayoutEditor from "./print-layouts/PrintLayoutEditor";
import PrintLayoutPreview from "./print-layouts/PrintLayoutPreview";
import { PrintLayout } from "@/types/printLayout";
import CreateLayoutDialog from "./print-layouts/CreateLayoutDialog";

const PrintLayoutsManager = () => {
  const {
    layouts,
    activeLayout,
    isLoading,
    error,
    updateLayout,
    deleteLayout,
    setDefault, // Cambiato da setDefaultLayout
    cloneLayout,
    createNewLayout,
    setActive // Cambiato da changeActiveLayout
  } = useMenuLayouts();
  
  const [selectedLayout, setSelectedLayout] = useState<PrintLayout | null>(null);
  const [editorTab, setEditorTab] = useState("lista");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Gestisci gli errori
  if (error) {
    toast.error(error);
  }

  const handleSelectLayout = (layout: PrintLayout) => {
    setSelectedLayout(layout);
    setEditorTab("modifica");
  };

  const handleUpdateLayout = (updatedLayout: PrintLayout) => {
    updateLayout(updatedLayout);
    toast.success("Layout aggiornato con successo");
    setSelectedLayout(updatedLayout);
  };

  const handleCloneLayout = async (layoutId: string) => {
    try {
      const clonedLayout = await cloneLayout(layoutId);
      if (clonedLayout) {
        toast.success("Layout clonato con successo");
        setSelectedLayout(clonedLayout);
        setEditorTab("modifica");
      }
    } catch (error) {
      console.error("Errore durante la clonazione del layout:", error);
      toast.error("Errore durante la clonazione del layout");
    }
  };

  const handleDeleteLayout = (layoutId: string) => {
    const success = deleteLayout(layoutId);
    if (success) {
      toast.success("Layout eliminato con successo");
      setSelectedLayout(null);
      setEditorTab("lista");
    }
  };

  const handleSetDefaultLayout = (layoutId: string) => {
    setDefault(layoutId); // Cambiato da setDefaultLayout
    toast.success("Layout impostato come predefinito");
  };

  const handleCreateLayout = async (name: string) => {
    try {
      const newLayout = await createNewLayout(name);
      if (newLayout) {
        setSelectedLayout(newLayout);
        setIsCreateDialogOpen(false);
        setEditorTab("modifica");
        toast.success("Layout creato con successo");
      }
    } catch (error) {
      console.error("Errore durante la creazione del layout:", error);
      toast.error("Errore durante la creazione del layout");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-6">Caricamento layouts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Layout di Stampa</h3>
          <p className="text-sm text-muted-foreground">
            Personalizza l'aspetto dei tuoi menu per la stampa.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Crea Nuovo Layout
        </Button>
      </div>

      <Separator />

      <Tabs value={editorTab} onValueChange={setEditorTab} className="w-full">
        <TabsList>
          <TabsTrigger value="lista">Lista Layout</TabsTrigger>
          <TabsTrigger value="modifica" disabled={!selectedLayout}>
            Modifica Layout
          </TabsTrigger>
          <TabsTrigger value="anteprima" disabled={!selectedLayout}>
            Anteprima
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4 mt-4">
          <PrintLayoutsList
            layouts={layouts}
            onSelectLayout={handleSelectLayout}
            onCloneLayout={handleCloneLayout}
            onDeleteLayout={handleDeleteLayout}
            onSetDefaultLayout={handleSetDefaultLayout}
          />
        </TabsContent>

        <TabsContent value="modifica" className="space-y-4 mt-4">
          {selectedLayout ? (
            <PrintLayoutEditor
              layout={selectedLayout}
              onSave={handleUpdateLayout}
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p>Seleziona un layout dalla lista per modificarlo.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="anteprima" className="space-y-4 mt-4">
          {selectedLayout ? (
            <PrintLayoutPreview layout={selectedLayout} />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p>Seleziona un layout dalla lista per visualizzare l'anteprima.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <CreateLayoutDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={handleCreateLayout}
      />
    </div>
  );
};

export default PrintLayoutsManager;
