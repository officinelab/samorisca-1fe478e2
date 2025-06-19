import { useState, useCallback } from "react";
import { PrintLayout, PrintLayoutElementConfig, ProductFeaturesConfig } from "@/types/printLayout";
import { syncPageMargins } from "@/hooks/menu-layouts/layoutOperations";
import { useGeneralTab } from "./useGeneralTab";
import { useElementsTab } from "./useElementsTab";
import { useCoverTab } from "./useCoverTab";
import { useSpacingTab } from "./useSpacingTab";
import { usePageSettingsTab } from "./usePageSettingsTab";
import { useCoverMarginsTab } from "./useCoverMarginsTab";
import { useAllergensTab } from "./useAllergensTab";
import { useAllergensMarginsTab } from "./useAllergensMarginsTab";
import { useCategoryNotesTab } from "./useCategoryNotesTab";
import { useProductFeaturesTab } from "./useProductFeaturesTab";
import { useServicePriceTab } from "./useServicePriceTab";
import { ensurePageMargins } from "./utils/ensurePageMargins";

export const useLayoutEditor = (layout: PrintLayout, onSave: (layout: PrintLayout) => void) => {
  const [editedLayout, setEditedLayout] = useState<PrintLayout>(ensurePageMargins(layout));
  const [activeTab, setActiveTab] = useState("generale");

  // General
  const {
    handleElementChange,
    handleElementMarginChange,
  } = useElementsTab(editedLayout, setEditedLayout);

  const handleVisibilityChange = (elementKey: keyof PrintLayout["elements"], visible: boolean) => {
    setEditedLayout((prev) => {
      return {
        ...prev,
        elements: {
          ...prev.elements,
          [elementKey]: {
            ...prev.elements[elementKey],
            visible: visible,
          },
        },
      };
    });
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
    handleLogoChange,
    handleCoverTitleChange,
    handleCoverSubtitleChange,
  } = useCoverTab(editedLayout, setEditedLayout);

  // Spacing tab
  const {
    handleSpacingChange,
  } = useSpacingTab(editedLayout, setEditedLayout);

  // Page settings tab
  const {
    handlePageConfigChange,
  } = usePageSettingsTab(editedLayout, setEditedLayout);

  // Cover margins tab
  const {
    handleCoverMarginsChange,
  } = useCoverMarginsTab(editedLayout, setEditedLayout);

  // Allergens tab
  const {
    handleAllergensChange,
    handleAllergensItemChange,
  } = useAllergensTab(editedLayout, setEditedLayout);

  // Allergens margins tab
  const {
    handleAllergensMarginsChange,
  } = useAllergensMarginsTab(editedLayout, setEditedLayout);

  // Category notes tab
  const {
    handleCategoryNotesChange,
    handleCategoryNotesIconChange,
    handleCategoryNotesTitleChange,
    handleCategoryNotesTextChange,
  } = useCategoryNotesTab(editedLayout, setEditedLayout);

  // Product features tab
  const {
    handleProductFeaturesIconChange,
    handleProductFeaturesTitleChange,
  } = useProductFeaturesTab(editedLayout, setEditedLayout);

  // Service price tab
  const {
    handleServicePriceChange,
  } = useServicePriceTab(editedLayout, setEditedLayout);

  const handleSave = () => {
    const layoutWithSyncedMargins = syncPageMargins(editedLayout);
    onSave(layoutWithSyncedMargins);
  };

  return {
    editedLayout,
    activeTab,
    setActiveTab,
    handleElementChange,
    handleElementMarginChange,
    handleVisibilityChange,
    handleProductFeaturesChange,
    handleLogoChange,
    handleCoverTitleChange,
    handleCoverSubtitleChange,
    handleSpacingChange,
    handlePageConfigChange,
    handleCoverMarginsChange,
    handleAllergensChange,
    handleAllergensItemChange,
    handleAllergensMarginsChange,
    handleCategoryNotesChange,
    handleCategoryNotesIconChange,
    handleCategoryNotesTitleChange,
    handleCategoryNotesTextChange,
    handleProductFeaturesIconChange,
    handleProductFeaturesTitleChange,
    handleServicePriceChange,
    handleSave
  };
};
