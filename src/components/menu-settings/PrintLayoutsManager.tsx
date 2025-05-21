
import { useState } from "react";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import PrintLayoutsList from "./print-layouts/PrintLayoutsList";
import PrintLayoutEditor from "./print-layouts/PrintLayoutEditor";
import PrintLayoutPreview from "./print-layouts/PrintLayoutPreview";
import { PrintLayout } from "@/types/printLayout";
import { Save, Printer, LayoutList, LayoutGrid } from "lucide-react";
// Eliminiamo import CreateLayoutDialog

const PrintLayoutsManager = () => {
  const {
    layouts,
    activeLayout,
    isLoading,
    error,
    updateLayout,
    deleteLayout,
    setDefaultLayout,
    cloneLayout,
    // createNewLayout, // Rimosso
    changeActiveLayout
  } = useMenuLayouts();

  const [selectedLayout, setSelectedLayout] = useState<PrintLayout | null>(null);
  const [editorTab, setEditorTab] = useState("lista");
  // const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false); // Rimosso

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
    setDefaultLayout(layoutId);
    toast.success("Layout impostato come predefinito");
  };

  // Eliminato handleCreateLayout

  if (isLoading) {
    return <div className="flex justify-center p-6">Caricamento layouts...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <LayoutGrid size={22} className="text-primary" />
              Gestione Layout di Stampa
            </CardTitle>
            <CardDescription>
              Crea e personalizza i layout per la stampa dei tuoi menu. Tutti i layout disponibili appaiono ordinati qui sotto.
            </CardDescription>
          </div>
          {/* <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
            + Nuovo Layout
          </Button> */}
          {/* Rimosso pulsante per la creazione */}
        </CardHeader>
      </Card>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Lista layouts (allargata del 20%) */}
        <div className="w-full lg:w-[260px] flex-shrink-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <LayoutList size={18} /> Tutti i Layout
              </CardTitle>
              <CardDescription className="text-xs">
                Modifica, duplica, elimina o imposta come predefinito uno dei tuoi layout.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="py-4">
              <PrintLayoutsList
                layouts={layouts}
                onSelectLayout={handleSelectLayout}
                onCloneLayout={handleCloneLayout}
                onDeleteLayout={handleDeleteLayout}
                onSetDefaultLayout={handleSetDefaultLayout}
                defaultFirst={true}
              />
            </CardContent>
          </Card>
        </div>
        {/* Modifica layout e anteprima: spazio extra */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Tab mobile: SWITCH modifica / anteprima */}
          <div className="flex gap-2 mb-2 lg:hidden">
            <Button
              variant={editorTab === "modifica" ? "secondary" : "ghost"}
              onClick={() => setEditorTab("modifica")}
              size="sm"
              className="flex-1"
            >
              <Save size={16} className="mr-1" /> Modifica Layout
            </Button>
            <Button
              variant={editorTab === "anteprima" ? "secondary" : "ghost"}
              onClick={() => setEditorTab("anteprima")}
              size="sm"
              className="flex-1"
            >
              <Printer size={16} className="mr-1" /> Anteprima
            </Button>
          </div>
          {/* MODIFICA */}
          {editorTab === "modifica" && (
            <div className="w-full">
              {selectedLayout ? (
                <PrintLayoutEditor layout={selectedLayout} onSave={handleUpdateLayout} />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                      Seleziona un layout dalla lista per modificarlo.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          {/* ANTEPRIMA */}
          {editorTab === "anteprima" && (
            <div className="w-full">
              {selectedLayout ? (
                <PrintLayoutPreview layout={selectedLayout} />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                      Seleziona un layout dalla lista per visualizzare l'anteprima.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Dialog nuovo layout: Rimosso */}
    </div>
  );
};

export default PrintLayoutsManager;

