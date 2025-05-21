
import { useState, useEffect } from "react";
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

const PrintLayoutsManager = () => {
  const {
    layouts,
    activeLayout,
    isLoading,
    error,
    updateLayout,
    // deleteLayout,
    // setDefaultLayout,
    // cloneLayout,
    // createNewLayout,
    // changeActiveLayout
  } = useMenuLayouts();

  // Mostra solo il layout predefinito (o il primo se non marcato come default)
  const [defaultLayout, setDefaultLayout] = useState<PrintLayout | null>(null);
  const [editorTab, setEditorTab] = useState("modifica");

  useEffect(() => {
    if (layouts && layouts.length > 0) {
      const foundDefault = layouts.find(l => l.isDefault) || layouts[0];
      setDefaultLayout(foundDefault ?? null);
    }
  }, [layouts]);

  // Gestisci eventuali errori
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Unico handler rimasto: aggiorna il layout predefinito
  const handleUpdateLayout = (updatedLayout: PrintLayout) => {
    updateLayout(updatedLayout);
    toast.success("Layout aggiornato con successo");
    setDefaultLayout(updatedLayout);
  };

  if (isLoading) {
    return <div className="flex justify-center p-6">Caricamento layouts...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <LayoutGrid size={22} className="text-primary" />
              Gestione Layout di Stampa
            </CardTitle>
            <CardDescription>
              È disponibile un solo layout di stampa che puoi personalizzare secondo le tue esigenze.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-[260px] flex-shrink-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <LayoutList size={18} /> Layout Predefinito
              </CardTitle>
              <CardDescription className="text-xs">
                Questo è l'unico layout disponibile per la stampa.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="py-4">
              {defaultLayout ? (
                <PrintLayoutsList
                  layouts={[defaultLayout]}
                  onSelectLayout={undefined}
                  onCloneLayout={undefined}
                  onDeleteLayout={undefined}
                  onSetDefaultLayout={undefined}
                  defaultFirst={true}
                  single
                />
              ) : (
                <div className="text-center text-muted-foreground text-sm py-6">
                  Nessun layout disponibile.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 flex flex-col gap-6 min-w-0">
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
              {defaultLayout ? (
                <PrintLayoutEditor layout={defaultLayout} onSave={handleUpdateLayout} />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                      Nessun layout selezionato.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          {/* ANTEPRIMA */}
          {editorTab === "anteprima" && (
            <div className="w-full">
              {defaultLayout ? (
                <PrintLayoutPreview layout={defaultLayout} />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                      Nessun layout da visualizzare.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintLayoutsManager;
