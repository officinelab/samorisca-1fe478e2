
import { useState } from "react";
import { PrintLayout, PrintLayoutElementConfig } from "@/types/printLayout";
import { syncPageMargins } from "@/hooks/menu-layouts/layoutOperations";
import { useGeneralTab } from "./useGeneralTab";
import { useElementsTab } from "./useElementsTab";
import { useCoverTab } from "./useCoverTab";
import { useAllergensTab } from "./useAllergensTab";
import { useCategoryNotesTab } from "./useCategoryNotesTab";
import { useProductFeaturesTab } from "./useProductFeaturesTab";
import { useSpacingTab } from "./useSpacingTab";
import { usePageSettingsTab } from "./usePageSettingsTab";
import { useCoverMarginsTab } from "./useCoverMarginsTab";
import { useAllergensMarginsTab } from "./useAllergensMarginsTab";
import { useServicePriceTab } from "./useServicePriceTab";
import { ensurePageMargins } from "./utils/ensurePageMargins";

export function useLayoutEditor(initialLayout: PrintLayout, onSave: (layout: PrintLayout) => void) {
  const [editedLayout, setEditedLayout] = useState<PrintLayout>(ensurePageMargins(initialLayout));
  const [activeTab, setActiveTab] = useState("generale");

  // General
  const { handleGeneralChange } = useGeneralTab(setEditedLayout);

  // Elements - non usare margin su suffix
  const { handleElementChange, handleElementMarginChange: origHandleElementMarginChange } = useElementsTab(setEditedLayout);
  // migliora la margin change: ignora se elementKey === "suffix"
  const handleElementMarginChange = (elementKey: keyof PrintLayout["elements"], marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
    if (elementKey === "suffix") return; // suffix non gestisce margin
    origHandleElementMarginChange(elementKey, marginKey, value);
  };

  // Product Features (existing in elements)
  const handleProductFeaturesChange = (field: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        productFeatures: {
          ...prev.elements.productFeatures,
          [field]: value
        }
      }
    }));
  };

  // Cover tab
  const {
    handleCoverLogoChange,
    handleCoverTitleChange,
    handleCoverTitleMarginChange,
    handleCoverSubtitleChange,
    handleCoverSubtitleMarginChange
  } = useCoverTab(setEditedLayout);

  // Allergens
  const {
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
    handleAllergensItemChange
  } = useAllergensTab(setEditedLayout);

  // Category Notes
  const {
    handleCategoryNotesIconChange,
    handleCategoryNotesTitleChange,
    handleCategoryNotesTitleMarginChange,
    handleCategoryNotesTextChange,
    handleCategoryNotesTextMarginChange
  } = useCategoryNotesTab(setEditedLayout);

  // Product Features (new layout section)
  const {
    handleProductFeaturesIconChange,
    handleProductFeaturesTitleChange,
    handleProductFeaturesTitleMarginChange
  } = useProductFeaturesTab(setEditedLayout);

  // Service Price tab
  const {
    handleServicePriceChange,
    handleServicePriceMarginChange
  } = useServicePriceTab(setEditedLayout);

  // Spacing
  const { handleSpacingChange } = useSpacingTab(setEditedLayout);

  // Page settings (existing)
  const {
    handlePageMarginChange,
    handleOddPageMarginChange,
    handleEvenPageMarginChange,
    handleToggleDistinctMargins
  } = usePageSettingsTab(setEditedLayout);

  // Cover margins (new)
  const { handleCoverMarginChange } = useCoverMarginsTab(setEditedLayout);

  // Allergens margins (new)
  const {
    handleAllergensMarginChange,
    handleAllergensOddPageMarginChange,
    handleAllergensEvenPageMarginChange,
    handleToggleDistinctAllergensMargins
  } = useAllergensMarginsTab(setEditedLayout);

  const handleSave = () => {
    const finalLayout = ensurePageMargins(syncPageMargins(editedLayout));
    onSave(finalLayout);
  };

  return {
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
    handleCoverMarginChange,
    handleAllergensMarginChange,
    handleAllergensOddPageMarginChange,
    handleAllergensEvenPageMarginChange,
    handleToggleDistinctAllergensMargins,
    handleSave
  };
}
