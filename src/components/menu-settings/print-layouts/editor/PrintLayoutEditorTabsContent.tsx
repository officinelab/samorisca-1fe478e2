
import React from "react";
import TabRenderer from "./components/TabRenderer";
import SaveLayoutSection from "./components/SaveLayoutSection";
import { PrintLayout, PrintLayoutElementConfig, CoverLogoConfig, CoverTitleConfig, CoverSubtitleConfig, ProductFeaturesConfig, CategoryNotesConfig, ServicePriceConfig } from "@/types/printLayout";

type TabKey = 
  | "generale" 
  | "elementi" 
  | "copertina" 
  | "allergeni" 
  | "notecategorie"
  | "caratteristicheprodotto"
  | "prezzoservizio"
  | "spaziatura" 
  | "pagina";

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
    <div className="flex-1 p-6 space-y-6">
      <TabRenderer {...props} />
      
      <SaveLayoutSection
        onSave={props.handleSaveWithValidation}
        validationError={props.validationError}
      />
    </div>
  );
};

export default PrintLayoutEditorTabsContent;
