
import React from "react";
import { PrintLayout, PrintLayoutElementConfig, CoverLogoConfig, CoverTitleConfig, CoverSubtitleConfig, ProductFeaturesConfig, CategoryNotesConfig } from "@/types/printLayout";
import TabRenderer from "./components/TabRenderer";
import SaveLayoutSection from "./components/SaveLayoutSection";

type TabKey = 
  | "generale" 
  | "pagina"
  | "copertina" 
  | "elementi" 
  | "notecategorie"
  | "spaziatura" 
  | "prezzoservizio"
  | "allergeni"
  | "caratteristicheprodotto";

interface PrintLayoutEditorTabsContentProps {
  activeTab: TabKey;
  editedLayout: PrintLayout;
  handleGeneralChange: (field: string, value: any) => void;
  handleElementChange: (elementKey: keyof PrintLayout["elements"], field: string, value: any) => void;
  handleElementMarginChange: (elementKey: keyof PrintLayout["elements"], marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  handleSpacingChange: (field: keyof PrintLayout["spacing"], value: number) => void;
  handlePageMarginChange: (field: keyof PrintLayout["page"], value: number) => void;
  handleOddPageMarginChange: (field: keyof PrintLayout["page"]["oddPages"], value: number) => void;
  handleEvenPageMarginChange: (field: keyof PrintLayout["page"]["evenPages"], value: number) => void;
  handleToggleDistinctMargins: () => void;
  handleCoverLogoChange: (field: keyof CoverLogoConfig, value: any) => void;
  handleCoverTitleChange: (field: keyof CoverTitleConfig, value: any) => void;
  handleCoverTitleMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  handleCoverSubtitleChange: (field: keyof CoverSubtitleConfig, value: any) => void;
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
  handleAllergensItemChange: (field: string, value: any) => void;
  handleCategoryNotesIconChange: (field: keyof CategoryNotesConfig["icon"], value: number) => void;
  handleCategoryNotesTitleChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  handleCategoryNotesTitleMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  handleCategoryNotesTextChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  handleCategoryNotesTextMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  handleProductFeaturesChange: (field: string, value: number) => void;
  handleProductFeaturesIconChange: (field: keyof ProductFeaturesConfig["icon"], value: number) => void;
  handleProductFeaturesTitleChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  handleProductFeaturesTitleMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  handleServicePriceChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  handleServicePriceMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  handleSaveWithValidation: () => void;
  validationError: string | null;
}

const PrintLayoutEditorTabsContent: React.FC<PrintLayoutEditorTabsContentProps> = (props) => {
  return (
    <div className="p-6 space-y-6">
      <TabRenderer
        activeTab={props.activeTab}
        editedLayout={props.editedLayout}
        handleGeneralChange={props.handleGeneralChange}
        handleElementChange={props.handleElementChange}
        handleElementMarginChange={props.handleElementMarginChange}
        handleSpacingChange={props.handleSpacingChange}
        handlePageMarginChange={props.handlePageMarginChange}
        handleOddPageMarginChange={props.handleOddPageMarginChange}
        handleEvenPageMarginChange={props.handleEvenPageMarginChange}
        handleToggleDistinctMargins={props.handleToggleDistinctMargins}
        handleCoverLogoChange={props.handleCoverLogoChange}
        handleCoverTitleChange={props.handleCoverTitleChange}
        handleCoverTitleMarginChange={props.handleCoverTitleMarginChange}
        handleCoverSubtitleChange={props.handleCoverSubtitleChange}
        handleCoverSubtitleMarginChange={props.handleCoverSubtitleMarginChange}
        handleAllergensTitleChange={props.handleAllergensTitleChange}
        handleAllergensTitleMarginChange={props.handleAllergensTitleMarginChange}
        handleAllergensDescriptionChange={props.handleAllergensDescriptionChange}
        handleAllergensDescriptionMarginChange={props.handleAllergensDescriptionMarginChange}
        handleAllergensItemNumberChange={props.handleAllergensItemNumberChange}
        handleAllergensItemNumberMarginChange={props.handleAllergensItemNumberMarginChange}
        handleAllergensItemTitleChange={props.handleAllergensItemTitleChange}
        handleAllergensItemTitleMarginChange={props.handleAllergensItemTitleMarginChange}
        handleAllergensItemDescriptionChange={props.handleAllergensItemDescriptionChange}
        handleAllergensItemDescriptionMarginChange={props.handleAllergensItemDescriptionMarginChange}
        handleAllergensItemChange={props.handleAllergensItemChange}
        handleCategoryNotesIconChange={props.handleCategoryNotesIconChange}
        handleCategoryNotesTitleChange={props.handleCategoryNotesTitleChange}
        handleCategoryNotesTitleMarginChange={props.handleCategoryNotesTitleMarginChange}
        handleCategoryNotesTextChange={props.handleCategoryNotesTextChange}
        handleCategoryNotesTextMarginChange={props.handleCategoryNotesTextMarginChange}
        handleProductFeaturesChange={props.handleProductFeaturesChange}
        handleProductFeaturesIconChange={props.handleProductFeaturesIconChange}
        handleProductFeaturesTitleChange={props.handleProductFeaturesTitleChange}
        handleProductFeaturesTitleMarginChange={props.handleProductFeaturesTitleMarginChange}
        handleServicePriceChange={props.handleServicePriceChange}
        handleServicePriceMarginChange={props.handleServicePriceMarginChange}
      />
      
      <SaveLayoutSection
        onSave={props.handleSaveWithValidation}
        validationError={props.validationError}
      />
    </div>
  );
};

export default PrintLayoutEditorTabsContent;
