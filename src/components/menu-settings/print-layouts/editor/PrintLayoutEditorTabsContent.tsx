
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import GeneralTab from "./GeneralTab";
import ElementsTab from "./ElementsTab";
import SpacingTab from "./SpacingTab";
import PageSettingsTab from "./PageSettingsTab";
import CoverLayoutTab from "./CoverLayoutTab";
import AllergensLayoutTab from "./AllergensLayoutTab";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

type TabKey =
  | "generale"
  | "elementi"
  | "copertina"
  | "allergeni"
  | "spaziatura"
  | "pagina";

interface TabsContentProps {
  activeTab: TabKey;
  editedLayout: any;
  handleGeneralChange: any;
  handleElementChange: any;
  handleElementMarginChange: any;
  handleSpacingChange: any;
  handlePageMarginChange: any;
  handleOddPageMarginChange: any;
  handleEvenPageMarginChange: any;
  handleToggleDistinctMargins: any;
  handleCoverLogoChange: any;
  handleCoverTitleChange: any;
  handleCoverTitleMarginChange: any;
  handleCoverSubtitleChange: any;
  handleCoverSubtitleMarginChange: any;
  handleAllergensTitleChange: any;
  handleAllergensTitleMarginChange: any;
  handleAllergensDescriptionChange: any;
  handleAllergensDescriptionMarginChange: any;
  handleAllergensItemNumberChange: any;
  handleAllergensItemNumberMarginChange: any;
  handleAllergensItemTitleChange: any;
  handleAllergensItemTitleMarginChange: any;
  handleAllergensItemChange: any;
  handleSaveWithValidation: any;
  validationError: string | null;
}

const PrintLayoutEditorTabsContent: React.FC<TabsContentProps> = ({
  activeTab,
  editedLayout,
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
  handleSaveWithValidation,
  validationError
}) => (
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
);

export default PrintLayoutEditorTabsContent;
