
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import PrintLayoutEditor from "./print-layouts/PrintLayoutEditor";
import PrintLayoutPreview from "./print-layouts/PrintLayoutPreview";
import { PrintLayout } from "@/types/printLayout";
import { Save, Printer, LayoutGrid } from "lucide-react";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import DefaultPrintLayoutCard from "./print-layouts/DefaultPrintLayoutCard";

const PrintLayoutsManager = () => {
  const {
    layouts,
    isLoading,
    error,
    updateLayout,
  } = useMenuLayouts();

  const [defaultLayout, setDefaultLayout] = useState<PrintLayout | null>(null);
  const [editorTab, setEditorTab] = useState("modifica");

  useEffect(() => {
    if (layouts && layouts.length > 0) {
      const foundDefault = layouts.find(l => l.isDefault) || layouts[0];
      setDefaultLayout(foundDefault ?? null);
    }
  }, [layouts]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Unico handler: aggiorna il layout predefinito
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
      {/* Header row with both sections */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="bg-card rounded-lg shadow px-4 py-3 flex-1">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <LayoutGrid size={22} className="text-primary" />
            Gestione Layout di Stampa
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            È disponibile un solo layout di stampa che puoi personalizzare secondo le tue esigenze.
          </div>
        </div>
        
        <div className="xl:w-[280px] flex-shrink-0">
          <DefaultPrintLayoutCard layout={defaultLayout} />
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="flex gap-2 mb-2 lg:hidden">
            <button
              className={`flex-1 px-4 py-2 rounded ${editorTab === "modifica" ? "bg-primary/80 text-white" : "bg-muted"}`}
              onClick={() => setEditorTab("modifica")}
              type="button"
            >
              <Save size={16} className="mr-1" /> Modifica Layout
            </button>
            <button
              className={`flex-1 px-4 py-2 rounded ${editorTab === "anteprima" ? "bg-primary/80 text-white" : "bg-muted"}`}
              onClick={() => setEditorTab("anteprima")}
              type="button"
            >
              <Printer size={16} className="mr-1" /> Anteprima
            </button>
          </div>
          {/* MODIFICA */}
          {editorTab === "modifica" && (
            <div className="w-full">
              {defaultLayout ? (
                <PrintLayoutEditor layout={defaultLayout} onSave={handleUpdateLayout} />
              ) : (
                <div className="bg-card border rounded-lg shadow p-6 text-muted-foreground text-center">
                  Nessun layout selezionato.
                </div>
              )}
            </div>
          )}
          {/* ANTEPRIMA */}
          {editorTab === "anteprima" && (
            <div className="w-full">
              {defaultLayout ? (
                <PrintLayoutPreview layout={defaultLayout} />
              ) : (
                <div className="bg-card border rounded-lg shadow p-6 text-muted-foreground text-center">
                  Nessun layout da visualizzare.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintLayoutsManager;
