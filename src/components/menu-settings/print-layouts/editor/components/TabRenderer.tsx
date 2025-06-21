import React from "react";
import GeneralTab from "../GeneralTab";
import ElementsTab from "../ElementsTab";
import CoverLayoutTab from "../CoverLayoutTab";
import AllergensLayoutTab from "../AllergensLayoutTab";
import CategoryNotesTab from "../CategoryNotesTab";
import ProductFeaturesTab from "../ProductFeaturesTab";
import ServicePriceTab from "../ServicePriceTab";
import SpacingTab from "../SpacingTab";
import PageSettingsTab from "../PageSettingsTab";
import { PrintLayout, PrintLayoutElementConfig, CoverLogoConfig, CoverTitleConfig, CoverSubtitleConfig, ProductFeaturesConfig, CategoryNotesConfig, PageMargins } from "@/types/printLayout";

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

interface TabRendererProps {
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
  handleProductFeaturesSectionTitleChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  handleProductFeaturesSectionTitleMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  handleProductFeaturesItemTitleChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  handleProductFeaturesItemTitleMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  handleServicePriceChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  handleServicePriceMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  handleCoverMarginChange: (field: string, value: number) => void;
  handleAllergensMarginChange: (field: keyof PageMargins, value: number) => void;
  handleAllergensOddPageMarginChange: (field: keyof PageMargins, value: number) => void;
  handleAllergensEvenPageMarginChange: (field: keyof PageMargins, value: number) => void;
  handleToggleDistinctAllergensMargins: (useDistinct: boolean) => void;
}

const TabRenderer: React.FC<TabRendererProps> = (props) => {
  const { activeTab, editedLayout } = props;

  switch (activeTab) {
    case "generale":
      return (
        <GeneralTab
          layout={editedLayout}
          onGeneralChange={props.handleGeneralChange}
        />
      );
    case "pagina":
      return (
        <PageSettingsTab
          layout={editedLayout}
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
      );
    case "copertina":
      return (
        <CoverLayoutTab
          layout={editedLayout}
          onCoverLogoChange={props.handleCoverLogoChange}
          onCoverTitleChange={props.handleCoverTitleChange}
          onCoverTitleMarginChange={props.handleCoverTitleMarginChange}
          onCoverSubtitleChange={props.handleCoverSubtitleChange}
          onCoverSubtitleMarginChange={props.handleCoverSubtitleMarginChange}
        />
      );
    case "elementi":
      return (
        <ElementsTab
          layout={editedLayout}
          onElementChange={props.handleElementChange}
          onElementMarginChange={props.handleElementMarginChange}
          onProductFeaturesChange={props.handleProductFeaturesChange}
        />
      );
    case "notecategorie":
      return (
        <CategoryNotesTab
          layout={editedLayout}
          onCategoryNotesIconChange={props.handleCategoryNotesIconChange}
          onCategoryNotesTitleChange={props.handleCategoryNotesTitleChange}
          onCategoryNotesTitleMarginChange={props.handleCategoryNotesTitleMarginChange}
          onCategoryNotesTextChange={props.handleCategoryNotesTextChange}
          onCategoryNotesTextMarginChange={props.handleCategoryNotesTextMarginChange}
        />
      );
    case "spaziatura":
      return (
        <SpacingTab
          layout={editedLayout}
          onSpacingChange={props.handleSpacingChange}
        />
      );
    case "prezzoservizio":
      return (
        <ServicePriceTab
          layout={editedLayout}
          onServicePriceChange={props.handleServicePriceChange}
          onServicePriceMarginChange={props.handleServicePriceMarginChange}
        />
      );
    case "allergeni":
      return (
        <AllergensLayoutTab
          layout={editedLayout}
          onAllergensTitleChange={props.handleAllergensTitleChange}
          onAllergensTitleMarginChange={props.handleAllergensTitleMarginChange}
          onAllergensDescriptionChange={props.handleAllergensDescriptionChange}
          onAllergensDescriptionMarginChange={props.handleAllergensDescriptionMarginChange}
          onAllergensItemNumberChange={props.handleAllergensItemNumberChange}
          onAllergensItemNumberMarginChange={props.handleAllergensItemNumberMarginChange}
          onAllergensItemTitleChange={props.handleAllergensItemTitleChange}
          onAllergensItemTitleMarginChange={props.handleAllergensItemTitleMarginChange}
          onAllergensItemDescriptionChange={props.handleAllergensItemDescriptionChange}
          onAllergensItemDescriptionMarginChange={props.handleAllergensItemDescriptionMarginChange}
          onAllergensItemChange={props.handleAllergensItemChange}
        />
      );
    case "caratteristicheprodotto":
      return (
        <ProductFeaturesTab
          layout={editedLayout}
          onProductFeaturesIconChange={props.handleProductFeaturesIconChange}
          onProductFeaturesSectionTitleChange={props.handleProductFeaturesSectionTitleChange}
          onProductFeaturesSectionTitleMarginChange={props.handleProductFeaturesSectionTitleMarginChange}
          onProductFeaturesItemTitleChange={props.handleProductFeaturesItemTitleChange}
          onProductFeaturesItemTitleMarginChange={props.handleProductFeaturesItemTitleMarginChange}
        />
      );
    default:
      return null;
  }
};

export default TabRenderer;
