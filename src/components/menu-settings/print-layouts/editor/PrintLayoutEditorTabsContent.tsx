
import React from "react";
import { PageMargins, PrintLayout } from "@/types/printLayout";
import GeneralTab from "./GeneralTab";
import PageSettingsTab from "./PageSettingsTab";
import CoverLayoutTab from "./CoverLayoutTab";
import ElementsTab from "./ElementsTab";
import CategoryNotesTab from "./CategoryNotesTab";
import SpacingTab from "./SpacingTab";
import ServicePriceTab from "./ServicePriceTab";
import AllergensLayoutTab from "./AllergensLayoutTab";
import ProductFeaturesTab from "./ProductFeaturesTab";
import SaveLayoutSection from "./components/SaveLayoutSection";

interface PrintLayoutEditorTabsContentProps {
  activeTab: string;
  editedLayout: PrintLayout;
  handleGeneralChange: (field: string, value: any) => void;
  handleElementChange: (elementKey: keyof PrintLayout["elements"], field: string, value: any) => void;
  handleElementMarginChange: (elementKey: keyof PrintLayout["elements"], marginKey: keyof PrintLayout["elements"]["title"]["margin"], value: number) => void;
  handleSpacingChange: (field: keyof PrintLayout["spacing"], value: number) => void;
  handlePageMarginChange: (field: keyof PageMargins, value: number) => void;
  handleOddPageMarginChange: (field: keyof PageMargins, value: number) => void;
  handleEvenPageMarginChange: (field: keyof PageMargins, value: number) => void;
  handleToggleDistinctMargins: (useDistinct: boolean) => void;
  handleCoverLogoChange: (field: string, value: any) => void;
  handleCoverTitleChange: (field: string, value: any) => void;
  handleCoverTitleMarginChange: (marginKey: keyof PrintLayout["cover"]["title"]["margin"], value: number) => void;
  handleCoverSubtitleChange: (field: string, value: any) => void;
  handleCoverSubtitleMarginChange: (marginKey: keyof PrintLayout["cover"]["subtitle"]["margin"], value: number) => void;
  handleAllergensTitleChange: (field: string, value: any) => void;
  handleAllergensTitleMarginChange: (marginKey: keyof PrintLayout["allergens"]["title"]["margin"], value: number) => void;
  handleAllergensDescriptionChange: (field: string, value: any) => void;
  handleAllergensDescriptionMarginChange: (marginKey: keyof PrintLayout["allergens"]["description"]["margin"], value: number) => void;
  handleAllergensItemNumberChange: (field: string, value: any) => void;
  handleAllergensItemNumberMarginChange: (marginKey: keyof PrintLayout["allergens"]["item"]["number"]["margin"], value: number) => void;
  handleAllergensItemTitleChange: (field: string, value: any) => void;
  handleAllergensItemTitleMarginChange: (marginKey: keyof PrintLayout["allergens"]["item"]["title"]["margin"], value: number) => void;
  handleAllergensItemDescriptionChange: (field: string, value: any) => void;
  handleAllergensItemDescriptionMarginChange: (marginKey: keyof PrintLayout["allergens"]["item"]["description"]["margin"], value: number) => void;
  handleAllergensItemChange: (field: string, value: any) => void;
  handleCategoryNotesIconChange: (field: string, value: number) => void;
  handleCategoryNotesTitleChange: (field: string, value: any) => void;
  handleCategoryNotesTitleMarginChange: (marginKey: keyof PrintLayout["categoryNotes"]["title"]["margin"], value: number) => void;
  handleCategoryNotesTextChange: (field: string, value: any) => void;
  handleCategoryNotesTextMarginChange: (marginKey: keyof PrintLayout["categoryNotes"]["text"]["margin"], value: number) => void;
  handleProductFeaturesChange: (field: string, value: number) => void;
  handleProductFeaturesIconChange: (field: string, value: number) => void;
  handleProductFeaturesTitleChange: (field: string, value: any) => void;
  handleProductFeaturesTitleMarginChange: (marginKey: keyof PrintLayout["productFeatures"]["title"]["margin"], value: number) => void;
  handleServicePriceChange: (field: string, value: any) => void;
  handleServicePriceMarginChange: (marginKey: keyof PrintLayout["servicePrice"]["margin"], value: number) => void;
  handleCoverMarginChange: (field: string, value: number) => void;
  handleAllergensMarginChange: (field: keyof PageMargins, value: number) => void;
  handleAllergensOddPageMarginChange: (field: keyof PageMargins, value: number) => void;
  handleAllergensEvenPageMarginChange: (field: keyof PageMargins, value: number) => void;
  handleToggleDistinctAllergensMargins: (useDistinct: boolean) => void;
  handleSaveWithValidation: () => void;
  validationError: string | null;
}

const PrintLayoutEditorTabsContent: React.FC<PrintLayoutEditorTabsContentProps> = (props) => {
  const { activeTab } = props;

  return (
    <div className="p-6 space-y-6">
      {activeTab === "generale" && (
        <GeneralTab
          layout={props.editedLayout}
          onChange={props.handleGeneralChange}
        />
      )}

      {activeTab === "pagina" && (
        <PageSettingsTab
          layout={props.editedLayout}
          onPageMarginChange={props.handlePageMarginChange}
          onOddPageMarginChange={props.handleOddPageMarginChange}
          onEvenPageMarginChange={props.handleEvenPageMarginChange}
          onToggleDistinctMargins={props.handleToggleDistinctMargins}
          onCoverMarginChange={props.handleCoverMarginChange}
          onAllergensMarginChange={props.handleAllergensMarginChange}
          onAllergensOddPageMarginChange={props.handleAllergensOddPageMarginChange}
          onAllergensEvenPageMarginChange={props.handleAllergensEvenPageMarginChange}
          onToggleDistinctAllergensMargins={props.handleToggleDistinctAllergensMargins}
        />
      )}

      {activeTab === "copertina" && (
        <CoverLayoutTab
          layout={props.editedLayout}
          onLogoChange={props.handleCoverLogoChange}
          onTitleChange={props.handleCoverTitleChange}
          onTitleMarginChange={props.handleCoverTitleMarginChange}
          onSubtitleChange={props.handleCoverSubtitleChange}
          onSubtitleMarginChange={props.handleCoverSubtitleMarginChange}
        />
      )}

      {activeTab === "elementi" && (
        <ElementsTab
          layout={props.editedLayout}
          onElementChange={props.handleElementChange}
          onElementMarginChange={props.handleElementMarginChange}
          onProductFeaturesChange={props.handleProductFeaturesChange}
        />
      )}

      {activeTab === "notecategorie" && (
        <CategoryNotesTab
          layout={props.editedLayout}
          onIconChange={props.handleCategoryNotesIconChange}
          onTitleChange={props.handleCategoryNotesTitleChange}
          onTitleMarginChange={props.handleCategoryNotesTitleMarginChange}
          onTextChange={props.handleCategoryNotesTextChange}
          onTextMarginChange={props.handleCategoryNotesTextMarginChange}
        />
      )}

      {activeTab === "spaziatura" && (
        <SpacingTab
          layout={props.editedLayout}
          onChange={props.handleSpacingChange}
        />
      )}

      {activeTab === "prezzoservizio" && (
        <ServicePriceTab
          layout={props.editedLayout}
          onChange={props.handleServicePriceChange}
          onMarginChange={props.handleServicePriceMarginChange}
        />
      )}

      {activeTab === "allergeni" && (
        <AllergensLayoutTab
          layout={props.editedLayout}
          onTitleChange={props.handleAllergensTitleChange}
          onTitleMarginChange={props.handleAllergensTitleMarginChange}
          onDescriptionChange={props.handleAllergensDescriptionChange}
          onDescriptionMarginChange={props.handleAllergensDescriptionMarginChange}
          onItemNumberChange={props.handleAllergensItemNumberChange}
          onItemNumberMarginChange={props.handleAllergensItemNumberMarginChange}
          onItemTitleChange={props.handleAllergensItemTitleChange}
          onItemTitleMarginChange={props.handleAllergensItemTitleMarginChange}
          onItemDescriptionChange={props.handleAllergensItemDescriptionChange}
          onItemDescriptionMarginChange={props.handleAllergensItemDescriptionMarginChange}
          onItemChange={props.handleAllergensItemChange}
        />
      )}

      {activeTab === "caratteristicheprodotto" && (
        <ProductFeaturesTab
          layout={props.editedLayout}
          onIconChange={props.handleProductFeaturesIconChange}
          onTitleChange={props.handleProductFeaturesTitleChange}
          onTitleMarginChange={props.handleProductFeaturesTitleMarginChange}
        />
      )}

      <SaveLayoutSection
        onSave={props.handleSaveWithValidation}
        validationError={props.validationError}
      />
    </div>
  );
};

export default PrintLayoutEditorTabsContent;
