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
  // Fallback completo e sicuro per cover
  const updatedCover = {
    logo: {
      visible: typeof layout.cover?.logo?.visible === "boolean" ? layout.cover.logo.visible : false,
      maxWidth: layout.cover?.logo?.maxWidth ?? 80,
      maxHeight: layout.cover?.logo?.maxHeight ?? 50,
      alignment: layout.cover?.logo?.alignment ?? "center",
      marginTop: layout.cover?.logo?.marginTop ?? 20,
      marginBottom: layout.cover?.logo?.marginBottom ?? 20
    },
    title: {
      visible: layout.cover?.title?.visible ?? true,
      fontFamily: layout.cover?.title?.fontFamily ?? "Arial",
      fontSize: layout.cover?.title?.fontSize ?? 24,
      fontColor: layout.cover?.title?.fontColor ?? "#000000",
      fontStyle: layout.cover?.title?.fontStyle ?? "bold",
      alignment: layout.cover?.title?.alignment ?? "center",
      margin: {
        top: layout.cover?.title?.margin?.top ?? 20,
        right: layout.cover?.title?.margin?.right ?? 0,
        bottom: layout.cover?.title?.margin?.bottom ?? 10,
        left: layout.cover?.title?.margin?.left ?? 0
      }
    },
    subtitle: {
      visible: layout.cover?.subtitle?.visible ?? true,
      fontFamily: layout.cover?.subtitle?.fontFamily ?? "Arial",
      fontSize: layout.cover?.subtitle?.fontSize ?? 14,
      fontColor: layout.cover?.subtitle?.fontColor ?? "#666666",
      fontStyle: layout.cover?.subtitle?.fontStyle ?? "italic",
      alignment: layout.cover?.subtitle?.alignment ?? "center",
      margin: {
        top: layout.cover?.subtitle?.margin?.top ?? 5,
        right: layout.cover?.subtitle?.margin?.right ?? 0,
        bottom: layout.cover?.subtitle?.margin?.bottom ?? 0,
        left: layout.cover?.subtitle?.margin?.left ?? 0
      }
    },
    ...(layout.cover || {}) // eventuali proprietà "custom" già definite
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
      visible: true,
      fontFamily: "Arial",
      fontSize: 22,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 15, left: 0 }
    },
    description: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 15, left: 0 }
    },
    item: {
      number: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 8, bottom: 0, left: 0 }
      },
      title: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
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
  // Forza sempre un valore booleano per visible anche su logo mancante
  const cover = layout.cover ?? {};
  let logo = cover.logo;
  if (!logo || typeof logo !== "object") logo = {};
  let visibleField = (logo as any).visible;
  if (typeof visibleField !== "boolean") visibleField = false;
  return {
    ...layout,
    cover: {
      ...cover,
      logo: {
        ...logo,
        visible: visibleField,
        maxWidth: logo.maxWidth ?? 80,
        maxHeight: logo.maxHeight ?? 50,
        alignment: logo.alignment ?? "center",
        marginTop: logo.marginTop ?? 20,
        marginBottom: logo.marginBottom ?? 20
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
