
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

const sectionCardStyle = "shadow border border-card/80 rounded-2xl bg-gradient-to-br from-white via-card to-[#f3eefd]";

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
  <div className="py-4 px-2 md:px-10">
    {activeTab === "generale" && (
      <div className="mb-8">
        <h3 className="text-2xl md:text-2xl font-extrabold font-serif mb-3 text-primary/90">Impostazioni generali</h3>
        <Card className={sectionCardStyle + " mb-7"}>
          <CardContent className="px-0 sm:px-7 py-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <GeneralTab
                layout={editedLayout}
                onGeneralChange={handleGeneralChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    )}
    {activeTab === "elementi" && (
      <div className="mb-8">
        <h3 className="text-2xl font-extrabold font-serif mb-3 text-primary/90">Stili elementi del menu</h3>
        <Card className={sectionCardStyle + " mb-7"}>
          <CardContent className="px-0 sm:px-7 py-7">
            <div className="grid gap-8">
              <ElementsTab
                layout={editedLayout}
                onElementChange={handleElementChange}
                onElementMarginChange={handleElementMarginChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    )}
    {activeTab === "copertina" && (
      <div className="mb-8">
        <h3 className="text-2xl font-extrabold font-serif mb-3 text-primary/90">Copertina</h3>
        <Card className={sectionCardStyle + " mb-7"}>
          <CardContent className="px-0 sm:px-7 py-7">
            <div className="grid md:grid-cols-2 gap-10">
              <CoverLayoutTab
                layout={editedLayout}
                onCoverLogoChange={handleCoverLogoChange}
                onCoverTitleChange={handleCoverTitleChange}
                onCoverTitleMarginChange={handleCoverTitleMarginChange}
                onCoverSubtitleChange={handleCoverSubtitleChange}
                onCoverSubtitleMarginChange={handleCoverSubtitleMarginChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    )}
    {activeTab === "allergeni" && (
      <div className="mb-8">
        <h3 className="text-2xl font-extrabold font-serif mb-3 text-primary/90">Pagina Allergeni</h3>
        <Card className={sectionCardStyle + " mb-7"}>
          <CardContent className="px-0 sm:px-7 py-7">
            <div className="grid md:grid-cols-2 gap-10">
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
            </div>
          </CardContent>
        </Card>
      </div>
    )}
    {activeTab === "spaziatura" && (
      <div className="mb-8">
        <h3 className="text-2xl font-extrabold font-serif mb-3 text-primary/90">Spaziature menu</h3>
        <Card className={sectionCardStyle + " mb-7"}>
          <CardContent className="px-0 sm:px-7 py-7">
            <div className="grid md:grid-cols-2 gap-10">
              <SpacingTab
                layout={editedLayout}
                onSpacingChange={handleSpacingChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    )}
    {activeTab === "pagina" && (
      <div className="mb-8">
        <h3 className="text-2xl font-extrabold font-serif mb-3 text-primary/90">Impostazioni pagina</h3>
        <Card className={sectionCardStyle + " mb-7"}>
          <CardContent className="px-0 sm:px-7 py-7">
            <div className="grid md:grid-cols-2 gap-10">
              <PageSettingsTab
                layout={editedLayout}
                onPageMarginChange={handlePageMarginChange}
                onOddPageMarginChange={handleOddPageMarginChange}
                onEvenPageMarginChange={handleEvenPageMarginChange}
                onToggleDistinctMargins={handleToggleDistinctMargins}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    )}

    <Separator className="my-9" />

    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-2 pb-4">
      <div>
        {validationError && (
          <span className="text-base text-red-500 font-semibold">{validationError}</span>
        )}
      </div>
      <Button
        onClick={handleSaveWithValidation}
        className="w-full md:w-auto mt-3 md:mt-0 px-8 py-2.5 text-lg font-bold rounded-lg hover:bg-gradient-to-br from-primary/90 to-purple-600"
        variant="default"
      >
        <Save size={20} className="mr-2" />
        Salva modifiche
      </Button>
    </div>
  </div>
);

export default PrintLayoutEditorTabsContent;
