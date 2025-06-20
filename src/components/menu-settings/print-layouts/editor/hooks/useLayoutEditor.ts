
import { useState, useCallback } from "react";
import { PrintLayout, PrintLayoutElementConfig, ProductFeaturesConfig } from "@/types/printLayout";
import { syncPageMargins } from "@/hooks/menu-layouts/layoutOperations";
import { useGeneralTab } from "./useGeneralTab";
import { useElementsTab } from "./useElementsTab";
import { useCoverTab } from "./useCoverTab";
import { useAllergensTab } from "./useAllergensTab";
import { useCategoryNotesTab } from "./useCategoryNotesTab";
import { useProductFeaturesTab } from "./useProductFeaturesTab";
import { usePageBreaksTab } from "./usePageBreaksTab";
import { useSpacingTab } from "./useSpacingTab";
import { usePageSettingsTab } from "./usePageSettingsTab";
import { useCoverMarginsTab } from "./useCoverMarginsTab";
import { useAllergensMarginsTab } from "./useAllergensMarginsTab";
import { useServicePriceTab } from "./useServicePriceTab";
import { ensurePageMargins } from "./utils/ensurePageMargins";

export const useLayoutEditor = (layout: PrintLayout, onSave: (layout: PrintLayout) => void) => {
  const [editedLayout, setEditedLayout] = useState<PrintLayout>(ensurePageMargins(layout));
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
  const handleProductFeaturesChange = useCallback(
    (field: keyof ProductFeaturesConfig, value: any) => {
      console.log('handleProductFeaturesChange called:', field, value); // Debug log
      setEditedLayout((prev) => {
        const newLayout = {
          ...prev,
          productFeatures: {
            ...prev.productFeatures,
            [field]: value,
          },
        };
        console.log('New layout productFeatures:', newLayout.productFeatures); // Debug log
        return newLayout;
      });
    },
    []
  );

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
    handleProductFeaturesSectionTitleChange,
    handleProductFeaturesSectionTitleMarginChange,
    handleProductFeaturesItemTitleChange,
    handleProductFeaturesItemTitleMarginChange
  } = useProductFeaturesTab(setEditedLayout);

  // Page Breaks (new section)
  const {
    handlePageBreaksChange
  } = usePageBreaksTab(setEditedLayout);

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
    handleProductFeaturesSectionTitleChange,
    handleProductFeaturesSectionTitleMarginChange,
    handleProductFeaturesItemTitleChange,
    handleProductFeaturesItemTitleMarginChange,
    handlePageBreaksChange,
    handleServicePriceChange,
    handleServicePriceMarginChange,
    handleCoverMarginChange,
    handleAllergensMarginChange,
    handleAllergensOddPageMarginChange,
    handleAllergensEvenPageMarginChange,
    handleToggleDistinctAllergensMargins,
    handleSave
  };
};
