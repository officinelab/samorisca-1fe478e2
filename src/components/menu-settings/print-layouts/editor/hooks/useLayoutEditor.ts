
import { useState } from "react";
import { PrintLayout, PrintLayoutElementConfig, CoverLogoConfig, CoverTitleConfig, CoverSubtitleConfig, ProductFeaturesConfig, CategoryNotesConfig } from "@/types/printLayout";
import { syncPageMargins } from "@/hooks/menu-layouts/layoutOperations";
import { useGeneralTab } from "./useGeneralTab";
import { useElementsTab } from "./useElementsTab";
import { useCoverTab } from "./useCoverTab";
import { useAllergensTab } from "./useAllergensTab";
import { useCategoryNotesTab } from "./useCategoryNotesTab";
import { useSpacingTab } from "./useSpacingTab";
import { usePageSettingsTab } from "./usePageSettingsTab";

// Util per valori safe
function ensurePageMargins(layout: PrintLayout): PrintLayout {
  // Logo
  const logo: CoverLogoConfig = {
    imageUrl: layout.cover?.logo?.imageUrl ?? "",
    maxWidth: layout.cover?.logo?.maxWidth ?? 80,
    maxHeight: layout.cover?.logo?.maxHeight ?? 50,
    alignment: layout.cover?.logo?.alignment ?? "center",
    marginTop: layout.cover?.logo?.marginTop ?? 20,
    marginBottom: layout.cover?.logo?.marginBottom ?? 20,
    visible: typeof layout.cover?.logo?.visible === "boolean" ? layout.cover.logo.visible : true,
  };

  // Title
  const title: CoverTitleConfig = {
    visible: typeof layout.cover?.title?.visible === "boolean" ? layout.cover.title.visible : true,
    fontFamily: layout.cover?.title?.fontFamily ?? "Arial",
    fontSize: layout.cover?.title?.fontSize ?? 24,
    fontColor: layout.cover?.title?.fontColor ?? "#000000",
    fontStyle: layout.cover?.title?.fontStyle ?? "bold",
    alignment: layout.cover?.title?.alignment ?? "center",
    margin: layout.cover?.title?.margin ?? { top: 20, right: 0, bottom: 10, left: 0 },
    menuTitle: layout.cover?.title?.menuTitle ?? "",
  };

  // Subtitle
  const subtitle: CoverSubtitleConfig = {
    visible: typeof layout.cover?.subtitle?.visible === "boolean" ? layout.cover.subtitle.visible : true,
    fontFamily: layout.cover?.subtitle?.fontFamily ?? "Arial",
    fontSize: layout.cover?.subtitle?.fontSize ?? 14,
    fontColor: layout.cover?.subtitle?.fontColor ?? "#666666",
    fontStyle: layout.cover?.subtitle?.fontStyle ?? "italic",
    alignment: layout.cover?.subtitle?.alignment ?? "center",
    margin: layout.cover?.subtitle?.margin ?? { top: 5, right: 0, bottom: 0, left: 0 },
    menuSubtitle: layout.cover?.subtitle?.menuSubtitle ?? "",
  };

  // Allergens item.description safe fallback (fix: cast e nullish checks)
  const allergensItem = layout.allergens?.item ?? {};
  const itemDescription: PrintLayoutElementConfig = {
    visible: typeof (allergensItem as any).description?.visible === "boolean" 
      ? (allergensItem as any).description.visible 
      : true,
    fontFamily: (allergensItem as any).description?.fontFamily ?? "Arial",
    fontSize: (allergensItem as any).description?.fontSize ?? 12,
    fontColor: (allergensItem as any).description?.fontColor ?? "#444444",
    fontStyle: (allergensItem as any).description?.fontStyle ?? "normal",
    alignment: (allergensItem as any).description?.alignment ?? "left",
    margin: (allergensItem as any).description?.margin ?? { top: 0, right: 0, bottom: 5, left: 0 }
  };

  // Category Notes fallback
  const categoryNotes: CategoryNotesConfig = {
    icon: {
      iconSize: layout.categoryNotes?.icon?.iconSize ?? 16
    },
    title: {
      visible: typeof layout.categoryNotes?.title?.visible === "boolean" ? layout.categoryNotes.title.visible : true,
      fontFamily: layout.categoryNotes?.title?.fontFamily ?? "Arial",
      fontSize: layout.categoryNotes?.title?.fontSize ?? 14,
      fontColor: layout.categoryNotes?.title?.fontColor ?? "#000000",
      fontStyle: layout.categoryNotes?.title?.fontStyle ?? "bold",
      alignment: layout.categoryNotes?.title?.alignment ?? "left",
      margin: layout.categoryNotes?.title?.margin ?? { top: 0, right: 0, bottom: 2, left: 0 }
    },
    text: {
      visible: typeof layout.categoryNotes?.text?.visible === "boolean" ? layout.categoryNotes.text.visible : true,
      fontFamily: layout.categoryNotes?.text?.fontFamily ?? "Arial",
      fontSize: layout.categoryNotes?.text?.fontSize ?? 12,
      fontColor: layout.categoryNotes?.text?.fontColor ?? "#333333",
      fontStyle: layout.categoryNotes?.text?.fontStyle ?? "normal",
      alignment: layout.categoryNotes?.text?.alignment ?? "left",
      margin: layout.categoryNotes?.text?.margin ?? { top: 0, right: 0, bottom: 0, left: 0 }
    }
  };

  return {
    ...layout,
    cover: { logo, title, subtitle },
    categoryNotes,
    allergens: {
      ...layout.allergens,
      item: {
        ...layout.allergens?.item,
        description: itemDescription,
      },
    },
  };
}

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

  // Product Features
  const handleProductFeaturesChange = (field: keyof ProductFeaturesConfig, value: number) => {
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

  // Spacing
  const { handleSpacingChange } = useSpacingTab(setEditedLayout);

  // Page settings
  const {
    handlePageMarginChange,
    handleOddPageMarginChange,
    handleEvenPageMarginChange,
    handleToggleDistinctMargins
  } = usePageSettingsTab(setEditedLayout);

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
    handleSave
  };
}
