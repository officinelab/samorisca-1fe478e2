import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import GeneralTab from "./GeneralTab";
import ElementsTab from "./ElementsTab";
import CoverLayoutTab from "./CoverLayoutTab";
import AllergensLayoutTab from "./AllergensLayoutTab";
import CategoryNotesTab from "./CategoryNotesTab";
import ProductFeaturesTab from "./ProductFeaturesTab";
import SpacingTab from "./SpacingTab";
import PageSettingsTab from "./PageSettingsTab";
import ServicePriceTab from "./ServicePriceTab";
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
  handleCategoryNotesIconChange,
  handleCategoryNotesTitleChange,
  handleCategoryNotesTitleMarginChange,
  handleCategoryNotesTextChange,
  handleCategoryNotesTextMarginChange,
  handleProductFeaturesChange,
  handleProductFeaturesIconChange,
  handleProductFeaturesTitleChange,
  handleProductFeaturesTitleMarginChange,
  handleServicePriceChange,
  handleServicePriceMarginChange,
  handleSaveWithValidation,
  validationError
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "generale":
        return (
          <GeneralTab
            layout={editedLayout}
            onGeneralChange={handleGeneralChange}
          />
        );
      case "elementi":
        return (
          <ElementsTab
            layout={editedLayout}
            onElementChange={handleElementChange}
            onElementMarginChange={handleElementMarginChange}
            onProductFeaturesChange={handleProductFeaturesChange}
          />
        );
      case "copertina":
        return (
          <CoverLayoutTab
            layout={editedLayout}
            onCoverLogoChange={handleCoverLogoChange}
            onCoverTitleChange={handleCoverTitleChange}
            onCoverTitleMarginChange={handleCoverTitleMarginChange}
            onCoverSubtitleChange={handleCoverSubtitleChange}
            onCoverSubtitleMarginChange={handleCoverSubtitleMarginChange}
          />
        );
      case "allergeni":
        return (
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
        );
      case "notecategorie":
        return (
          <CategoryNotesTab
            layout={editedLayout}
            onCategoryNotesIconChange={handleCategoryNotesIconChange}
            onCategoryNotesTitleChange={handleCategoryNotesTitleChange}
            onCategoryNotesTitleMarginChange={handleCategoryNotesTitleMarginChange}
            onCategoryNotesTextChange={handleCategoryNotesTextChange}
            onCategoryNotesTextMarginChange={handleCategoryNotesTextMarginChange}
          />
        );
      case "caratteristicheprodotto":
        return (
          <ProductFeaturesTab
            layout={editedLayout}
            onProductFeaturesIconChange={handleProductFeaturesIconChange}
            onProductFeaturesTitleChange={handleProductFeaturesTitleChange}
            onProductFeaturesTitleMarginChange={handleProductFeaturesTitleMarginChange}
          />
        );
      case "prezzoservizio":
        return (
          <ServicePriceTab
            layout={editedLayout}
            onServicePriceChange={handleServicePriceChange}
            onServicePriceMarginChange={handleServicePriceMarginChange}
          />
        );
      case "spaziatura":
        return (
          <SpacingTab
            layout={editedLayout}
            onSpacingChange={handleSpacingChange}
          />
        );
      case "pagina":
        return (
          <PageSettingsTab
            layout={editedLayout}
            onPageMarginChange={handlePageMarginChange}
            onOddPageMarginChange={handleOddPageMarginChange}
            onEvenPageMarginChange={handleEvenPageMarginChange}
            onToggleDistinctMargins={handleToggleDistinctMargins}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      {renderTabContent()}
      
      {validationError && (
        <Alert variant="destructive">
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardContent className="p-4">
          <Button 
            onClick={handleSaveWithValidation} 
            className="w-full"
            size="lg"
          >
            Salva Layout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintLayoutEditorTabsContent;
