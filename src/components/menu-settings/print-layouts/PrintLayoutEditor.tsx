
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PrintLayout } from "@/types/printLayout";
import { Save, layoutList, image, text, settings, folder, fileText } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type TabKey =
  | "generale"
  | "elementi"
  | "copertina"
  | "allergeni"
  | "spaziatura"
  | "pagina";

const SECTIONS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "generale", label: "Impostazioni generali", icon: <settings size={18} /> },
  { key: "elementi", label: "Elementi Menu", icon: <layoutList size={18} /> },
  { key: "copertina", label: "Copertina", icon: <image size={18} /> },
  { key: "allergeni", label: "Allergeni", icon: <folder size={18} /> },
  { key: "spaziatura", label: "Spaziatura", icon: <fileText size={18} /> },
  { key: "pagina", label: "Impostazioni Pagina", icon: <text size={18} /> },
];

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

  const [validationError, setValidationError] = useState<string | null>(null);

  // Validazione margini/font-size
  const validate = () => {
    const page = editedLayout.page;
    const allMargins = [
      page.marginTop, page.marginRight, page.marginBottom, page.marginLeft,
      ...(page.oddPages ? [page.oddPages.marginTop, page.oddPages.marginRight, page.oddPages.marginBottom, page.oddPages.marginLeft] : []),
      ...(page.evenPages ? [page.evenPages.marginTop, page.evenPages.marginRight, page.evenPages.marginBottom, page.evenPages.marginLeft] : [])
    ];
    const allFontSizes = [...Object.values(editedLayout.elements).map(e => e.fontSize)];
    if (allMargins.some(m => m < 0)) {
      setValidationError("I margini devono essere ≥ 0");
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
    <div className="w-full flex flex-col md:flex-row gap-6 h-full">
      {/* SIDEBAR SEZIONI */}
      <aside className="w-full md:w-60 flex-shrink-0 bg-card/80 rounded-lg shadow-xs p-3 border md:sticky md:top-28 self-start h-fit">
        <div className="mb-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Menu di modifica</div>
        </div>
        <nav>
          <ul className="flex md:flex-col gap-1">
            {SECTIONS.map(section => (
              <li key={section.key}>
                <button
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded transition
                    ${activeTab === section.key
                      ? "bg-primary/90 text-primary-foreground font-bold shadow"
                      : "hover:bg-muted text-muted-foreground"}
                  `}
                  onClick={() => setActiveTab(section.key)}
                  aria-current={activeTab === section.key ? "page" : undefined}
                  type="button"
                >
                  {section.icon}
                  <span>{section.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* AREA CONTENUTI SEZIONE */}
      <div className="flex-1 min-w-0 max-w-full">
        <Card className="rounded-lg border shadow-lg bg-white/95 overflow-visible w-full">
          <CardHeader className="border-b rounded-t-lg bg-muted/40">
            <CardTitle className="flex items-center gap-2">
              <Save size={22} className="text-primary" />
              <span className="text-lg font-semibold">Modifica layout</span>
              <span className="ml-2 font-normal text-sm text-muted-foreground truncate max-w-xs">{editedLayout.name}</span>
            </CardTitle>
            <CardDescription className="pt-1">
              Modifica il layout di stampa a destra, scegli prima la sezione dal menu qui a sinistra.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="py-4 px-2 md:px-8">
              {activeTab === "generale" && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">Impostazioni generali</h3>
                  <Card className="shadow border bg-white/90 mb-5">
                    <CardContent className="px-5 py-7">
                      <GeneralTab
                        layout={editedLayout}
                        onGeneralChange={handleGeneralChange}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
              {activeTab === "elementi" && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">Elementi modificabili del menu</h3>
                  <Card className="shadow border bg-white/90 mb-5">
                    <CardContent className="px-5 py-7">
                      <ElementsTab
                        layout={editedLayout}
                        onElementChange={handleElementChange}
                        onElementMarginChange={handleElementMarginChange}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
              {activeTab === "copertina" && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">Copertina</h3>
                  <Card className="shadow border bg-white/90 mb-5">
                    <CardContent className="px-3 sm:px-5 py-7">
                      <CoverLayoutTab
                        layout={editedLayout}
                        onCoverLogoChange={handleCoverLogoChange}
                        onCoverTitleChange={handleCoverTitleChange}
                        onCoverTitleMarginChange={handleCoverTitleMarginChange}
                        onCoverSubtitleChange={handleCoverSubtitleChange}
                        onCoverSubtitleMarginChange={handleCoverSubtitleMarginChange}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
              {activeTab === "allergeni" && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">Pagina Allergeni</h3>
                  <Card className="shadow border bg-white/90 mb-5">
                    <CardContent className="px-4 py-7">
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
                    </CardContent>
                  </Card>
                </div>
              )}
              {activeTab === "spaziatura" && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">Spaziatura Menu</h3>
                  <Card className="shadow border bg-white/90 mb-5">
                    <CardContent className="px-4 py-7">
                      <SpacingTab
                        layout={editedLayout}
                        onSpacingChange={handleSpacingChange}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
              {activeTab === "pagina" && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">Impostazioni Pagina</h3>
                  <Card className="shadow border bg-white/90 mb-5">
                    <CardContent className="px-4 py-7">
                      <PageSettingsTab
                        layout={editedLayout}
                        onPageMarginChange={handlePageMarginChange}
                        onOddPageMarginChange={handleOddPageMarginChange}
                        onEvenPageMarginChange={handleEvenPageMarginChange}
                        onToggleDistinctMargins={handleToggleDistinctMargins}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              <Separator className="my-6" />

              {/* Actions sulla destra nei desktop, sotto nei mobile */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-2 pb-4">
                <div>
                  {validationError && (
                    <span className="text-sm text-red-500">{validationError}</span>
                  )}
                </div>
                <Button
                  onClick={handleSaveWithValidation}
                  className="w-full md:w-auto mt-3 md:mt-0"
                  variant="default"
                >
                  <Save size={18} className="mr-2" />
                  Salva modifiche
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrintLayoutEditor;

