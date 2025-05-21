
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

  const handleUpdateLayout = (updatedLayout: PrintLayout) => {
    updateLayout(updatedLayout);
    toast.success("Layout aggiornato con successo");
    setDefaultLayout(updatedLayout);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-gradient-to-tr from-white via-card to-[#f6f8fd] rounded-2xl shadow-md px-7 py-5 flex flex-col md:flex-row md:items-center md:justify-between border border-card/80">
        <div>
          <div className="flex items-center gap-3 text-2xl font-extrabold tracking-tight text-primary drop-shadow">
            <LayoutGrid size={26} className="text-violet-700 bg-violet-100 rounded-full p-1" />
            <span className="font-serif tracking-wide">Layouts di stampa</span>
          </div>
          <div className="text-base text-muted-foreground mt-2">
            Puoi personalizzare il layout di stampa scegliendo stili, colori e formati con anteprima dal vivo.<br />
            Esplora i tab a destra per vedere tutte le opzioni.
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-[290px] flex-shrink-0">
          <DefaultPrintLayoutCard layout={defaultLayout} />
        </div>

        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="flex gap-2 mb-2 lg:hidden">
            <button
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors duration-150 ${editorTab === "modifica" ? "bg-primary/90 text-white shadow" : "bg-muted/70 border text-foreground"}`}
              onClick={() => setEditorTab("modifica")}
              type="button"
            >
              <Save size={18} className="mr-1" /> Modifica Layout
            </button>
            <button
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors duration-150 ${editorTab === "anteprima" ? "bg-primary/90 text-white shadow" : "bg-muted/70 border text-foreground"}`}
              onClick={() => setEditorTab("anteprima")}
              type="button"
            >
              <Printer size={18} className="mr-1" /> Anteprima
            </button>
          </div>
          {editorTab === "modifica" && (
            <div className="w-full">
              {defaultLayout ? (
                <PrintLayoutEditor layout={defaultLayout} onSave={handleUpdateLayout} />
              ) : (
                <div className="bg-card/80 border rounded-2xl shadow p-8 text-muted-foreground text-center">
                  Nessun layout selezionato.
                </div>
              )}
            </div>
          )}
          {editorTab === "anteprima" && (
            <div className="w-full">
              {defaultLayout ? (
                <PrintLayoutPreview layout={defaultLayout} />
              ) : (
                <div className="bg-card/80 border rounded-2xl shadow p-8 text-muted-foreground text-center">
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
