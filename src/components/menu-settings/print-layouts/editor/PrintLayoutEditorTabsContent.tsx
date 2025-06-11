
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PrintLayout, PrintLayoutElementConfig, ProductFeaturesConfig } from "@/types/printLayout";
import GeneralTab from "./GeneralTab";
import ElementsTab from "./ElementsTab";
import CoverLayoutTab from "./CoverLayoutTab";
import AllergensLayoutTab from "./AllergensLayoutTab";
import SpacingTab from "./SpacingTab";
import PageSettingsTab from "./PageSettingsTab";

type TabKey = "generale" | "elementi" | "copertina" | "allergeni" | "spaziatura" | "pagina";

interface PrintLayoutEditorTabsContentProps {
  activeTab: TabKey;
  editedLayout: PrintLayout;
  handleGeneralChange: (field: string, value: string | boolean) => void;
  handleElementChange: (
    elementKey: keyof PrintLayout["elements"],
    field: keyof PrintLayoutElementConfig,
    value: any
  ) => void;
  handleElementMarginChange: (
    elementKey: keyof PrintLayout["elements"],
    marginKey: keyof PrintLayoutElementConfig["margin"],
    value: number
  ) => void;
  handleSpacingChange: (spacingKey: keyof PrintLayout["spacing"], value: number) => void;
  handlePageMarginChange: (marginKey: keyof PrintLayout["page"], value: number) => void;
  handleOddPageMarginChange: (marginKey: keyof PrintLayout["page"]["oddPages"], value: number) => void;
  handleEvenPageMarginChange: (marginKey: keyof PrintLayout["page"]["evenPages"], value: number) => void;
  handleToggleDistinctMargins: (useDistinct: boolean) => void;
  handleCoverLogoChange: (field: keyof PrintLayout["cover"]["logo"], value: any) => void;
  handleCoverTitleChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  handleCoverTitleMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  handleCoverSubtitleChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  handleCoverSubtitleMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  handleAllergensTitleChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  handleAllergensTitleMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  handleAllergensDescriptionChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  handleAllergensDescriptionMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  handleAllergensItemNumberChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  handleAllergensItemNumberMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  handleAllergensItemTitleChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  handleAllergensItemTitleMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  handleAllergensItemDescriptionChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  handleAllergensItemDescriptionMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  handleAllergensItemChange: (field: keyof PrintLayout["allergens"]["item"], value: any) => void;
  handleProductFeaturesChange: (field: keyof ProductFeaturesConfig, value: number) => void;
  handleSaveWithValidation: () => void;
  validationError: string | null;
}

const PrintLayoutEditorTabsContent: React.FC<PrintLayoutEditorTabsContentProps> = ({
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
  handleAllergensItemDescriptionChange,
  handleAllergensItemDescriptionMarginChange,
  handleAllergensItemChange,
  handleProductFeaturesChange,
  handleSaveWithValidation,
  validationError,
}) => {
  return (
    <div className="p-6 space-y-6">
      {validationError && (
        <Alert variant="destructive">
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      {activeTab === "generale" && (
        <GeneralTab layout={editedLayout} onGeneralChange={handleGeneralChange} />
      )}

      {activeTab === "elementi" && (
        <ElementsTab
          layout={editedLayout}
          onElementChange={handleElementChange}
          onElementMarginChange={handleElementMarginChange}
          onProductFeaturesChange={handleProductFeaturesChange}
        />
      )}

      {activeTab === "copertina" && (
        <CoverLayoutTab
          layout={editedLayout}
          onCoverLogoChange={handleCoverLogoChange}
          onCoverTitleChange={handleCoverTitleChange}
          onCoverTitleMarginChange={handleCoverTitleMarginChange}
          onCoverSubtitleChange={handleCoverSubtitleChange}
          onCoverSubtitleMarginChange={handleCoverSubtitleMarginChange}
        />
      )}

      {activeTab === "allergeni" && (
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
          onAllergensItemDescriptionChange={handleAllergensItemDescriptionChange}
          onAllergensItemDescriptionMarginChange={handleAllergensItemDescriptionMarginChange}
          onAllergensItemChange={handleAllergensItemChange}
        />
      )}

      {activeTab === "spaziatura" && (
        <SpacingTab layout={editedLayout} onSpacingChange={handleSpacingChange} />
      )}

      {activeTab === "pagina" && (
        <PageSettingsTab
          layout={editedLayout}
          onPageMarginChange={handlePageMarginChange}
          onOddPageMarginChange={handleOddPageMarginChange}
          onEvenPageMarginChange={handleEvenPageMarginChange}
          onToggleDistinctMargins={handleToggleDistinctMargins}
        />
      )}

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleSaveWithValidation} size="lg">
          Salva Layout
        </Button>
      </div>
    </div>
  );
};

export default PrintLayoutEditorTabsContent;
