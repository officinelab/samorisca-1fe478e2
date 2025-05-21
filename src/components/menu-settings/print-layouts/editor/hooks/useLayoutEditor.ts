import { useState } from "react";
import { PrintLayout, PrintLayoutElementConfig } from "@/types/printLayout";
import { syncPageMargins } from "@/hooks/menu-layouts/layoutOperations";
import { useGeneralTab } from "./useGeneralTab";
import { useElementsTab } from "./useElementsTab";
import { useCoverTab } from "./useCoverTab";
import { useAllergensTab } from "./useAllergensTab";
import { useSpacingTab } from "./useSpacingTab";
import { usePageSettingsTab } from "./usePageSettingsTab";

// Utilities per default e validazioni (miglior fallback oggetto cover)
function ensurePageMargins(layout: PrintLayout): PrintLayout {
  // Default configs for cover
  const coverLogoDefaults = {
    imageUrl: layout.cover?.logo?.imageUrl ?? null,
    maxWidth: 80,
    maxHeight: 50,
    alignment: "center" as const,
    marginTop: 20,
    marginBottom: 20,
  };
  const coverTitleDefaults = {
    fontFamily: "Arial",
    fontSize: 24,
    fontColor: "#000000",
    fontStyle: "bold" as const,
    alignment: "center" as const,
    margin: { top: 20, right: 0, bottom: 10, left: 0 },
    menuTitle: layout.cover?.title?.menuTitle ?? undefined,
  };
  const coverSubtitleDefaults = {
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#666666",
    fontStyle: "italic" as const,
    alignment: "center" as const,
    margin: { top: 5, right: 0, bottom: 0, left: 0 },
    menuSubtitle: layout.cover?.subtitle?.menuSubtitle ?? undefined,
  };

  // Safe-merge all fields (logo, title, subtitle) for .cover
  const updatedCover = {
    logo: {
      ...coverLogoDefaults,
      ...(layout.cover && typeof layout.cover.logo === "object" ? layout.cover.logo : {}),
    },
    title: {
      ...coverTitleDefaults,
      ...(layout.cover && typeof layout.cover.title === "object" ? layout.cover.title : {}),
    },
    subtitle: {
      ...coverSubtitleDefaults,
      ...(layout.cover && typeof layout.cover.subtitle === "object" ? layout.cover.subtitle : {}),
    }
  };

  // Restanti default invariati sui campi allergeni e page margin...
  const pageWithDefaults = {
    ...layout.page,
    oddPages: layout.page.oddPages || {
      marginTop: layout.page.marginTop,
      marginRight: layout.page.marginRight,
      marginBottom: layout.page.marginBottom,
      marginLeft: layout.page.marginLeft
    },
    evenPages: layout.page.evenPages || {
      marginTop: layout.page.marginTop,
      marginRight: layout.page.marginRight,
      marginBottom: layout.page.marginBottom,
      marginLeft: layout.page.marginLeft
    }
  };

  const allergensWithDefaults = layout.allergens || {
    title: {
      fontFamily: "Arial",
      fontSize: 22,
      fontColor: "#000000",
      fontStyle: "bold" as const,
      alignment: "center" as const,
      margin: { top: 0, right: 0, bottom: 15, left: 0 }
    },
    description: {
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#333333",
      fontStyle: "normal" as const,
      alignment: "left" as const,
      margin: { top: 0, right: 0, bottom: 15, left: 0 }
    },
    item: {
      number: {
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#000000",
        fontStyle: "bold" as const,
        alignment: "left" as const,
        margin: { top: 0, right: 8, bottom: 0, left: 0 }
      },
      title: {
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#333333",
        fontStyle: "normal" as const,
        alignment: "left" as const,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      description: {
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#444444",
        fontStyle: "normal" as const,
        alignment: "left" as const,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      spacing: 10,
      backgroundColor: "#f9f9f9",
      borderRadius: 4,
      padding: 8
    }
  };

  return {
    ...layout,
    page: pageWithDefaults,
    cover: updatedCover,
    allergens: allergensWithDefaults,
  };
}

function ensureCoverLogoVisible(layout: PrintLayout): PrintLayout {
  const cover = layout.cover ?? { logo: {}, title: {}, subtitle: {} };
  let logo = cover.logo || {};
  return {
    ...layout,
    cover: {
      ...cover,
      logo: {
        maxWidth: logo.maxWidth ?? 80,
        maxHeight: logo.maxHeight ?? 50,
        alignment: logo.alignment ?? "center",
        marginTop: logo.marginTop ?? 20,
        marginBottom: logo.marginBottom ?? 20,
        imageUrl: logo.imageUrl ?? null,
      },
      title: cover.title,
      subtitle: cover.subtitle,
    },
  };
}

export function useLayoutEditor(initialLayout: PrintLayout, onSave: (layout: PrintLayout) => void) {
  const [editedLayout, setEditedLayout] = useState<PrintLayout>(
    ensureCoverLogoVisible(ensurePageMargins({ ...initialLayout }))
  );
  const [activeTab, setActiveTab] = useState("generale");

  // General
  const { handleGeneralChange } = useGeneralTab(setEditedLayout);

  // Elements
  const { handleElementChange, handleElementMarginChange } = useElementsTab(setEditedLayout);

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
    handleAllergensItemChange
  } = useAllergensTab(setEditedLayout);

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
    const finalLayout = ensureCoverLogoVisible(syncPageMargins(editedLayout));
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
    handleAllergensItemChange,
    handleSave
  };
}
