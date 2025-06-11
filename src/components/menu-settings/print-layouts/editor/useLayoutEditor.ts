import { useState } from "react";
import { PrintLayout, PrintLayoutElementConfig, CoverLogoConfig, CoverTitleConfig, CoverSubtitleConfig } from "@/types/printLayout";
import { syncPageMargins } from "@/hooks/menu-layouts/layoutOperations";
import { useGeneralTab } from "./hooks/useGeneralTab";
import { useElementsTab } from "./hooks/useElementsTab";
import { useCoverTab } from "./hooks/useCoverTab";
import { useAllergensTab } from "./hooks/useAllergensTab";
import { useSpacingTab } from "./hooks/useSpacingTab";
import { usePageSettingsTab } from "./hooks/usePageSettingsTab";

/**
 * Utility che garantisce la presenza di TUTTI i campi rilevanti nella struttura di salvataggio
 */
function ensureAllFields(layout: PrintLayout): PrintLayout {
  return {
    ...layout,
    name: layout.name ?? "",
    type: layout.type ?? "classic",
    isDefault: typeof layout.isDefault === "boolean" ? layout.isDefault : false,
    productSchema: layout.productSchema ?? "schema1",

    elements: {
      ...layout.elements,
      category: {
        ...layout.elements?.category,
        fontFamily: layout.elements?.category?.fontFamily ?? "Arial",
        fontSize: layout.elements?.category?.fontSize ?? 16,
        fontColor: layout.elements?.category?.fontColor ?? "#222222",
        fontStyle: layout.elements?.category?.fontStyle ?? "bold",
        alignment: layout.elements?.category?.alignment ?? "left",
        margin: {
          top: layout.elements?.category?.margin?.top ?? 0,
          right: layout.elements?.category?.margin?.right ?? 0,
          bottom: layout.elements?.category?.margin?.bottom ?? 0,
          left: layout.elements?.category?.margin?.left ?? 0,
        },
        visible: typeof layout.elements?.category?.visible === "boolean" ? layout.elements?.category?.visible : true,
      },
      title: {
        ...layout.elements?.title,
        fontFamily: layout.elements?.title?.fontFamily ?? "Arial",
        fontSize: layout.elements?.title?.fontSize ?? 16,
        fontColor: layout.elements?.title?.fontColor ?? "#222222",
        fontStyle: layout.elements?.title?.fontStyle ?? "bold",
        alignment: layout.elements?.title?.alignment ?? "left",
        margin: {
          top: layout.elements?.title?.margin?.top ?? 0,
          right: layout.elements?.title?.margin?.right ?? 0,
          bottom: layout.elements?.title?.margin?.bottom ?? 0,
          left: layout.elements?.title?.margin?.left ?? 0,
        },
        visible: typeof layout.elements?.title?.visible === "boolean" ? layout.elements?.title?.visible : true,
      },
      description: {
        ...layout.elements?.description,
        fontFamily: layout.elements?.description?.fontFamily ?? "Arial",
        fontSize: layout.elements?.description?.fontSize ?? 12,
        fontColor: layout.elements?.description?.fontColor ?? "#444444",
        fontStyle: layout.elements?.description?.fontStyle ?? "normal",
        alignment: layout.elements?.description?.alignment ?? "left",
        margin: {
          top: layout.elements?.description?.margin?.top ?? 0,
          right: layout.elements?.description?.margin?.right ?? 0,
          bottom: layout.elements?.description?.margin?.bottom ?? 0,
          left: layout.elements?.description?.margin?.left ?? 0,
        },
        visible: typeof layout.elements?.description?.visible === "boolean" ? layout.elements?.description?.visible : true,
      },

      // NEW: descriptionEng
      descriptionEng: {
        ...layout.elements?.descriptionEng,
        fontFamily: layout.elements?.descriptionEng?.fontFamily ?? "Arial",
        fontSize: layout.elements?.descriptionEng?.fontSize ?? 12,
        fontColor: layout.elements?.descriptionEng?.fontColor ?? "#444444",
        fontStyle: layout.elements?.descriptionEng?.fontStyle ?? "normal",
        alignment: layout.elements?.descriptionEng?.alignment ?? "left",
        margin: {
          top: layout.elements?.descriptionEng?.margin?.top ?? 0,
          right: layout.elements?.descriptionEng?.margin?.right ?? 0,
          bottom: layout.elements?.descriptionEng?.margin?.bottom ?? 0,
          left: layout.elements?.descriptionEng?.margin?.left ?? 0,
        },
        visible: typeof layout.elements?.descriptionEng?.visible === "boolean" ? layout.elements?.descriptionEng?.visible : true,
      },

      allergensList: {
        ...layout.elements?.allergensList,
        fontFamily: layout.elements?.allergensList?.fontFamily ?? "Arial",
        fontSize: layout.elements?.allergensList?.fontSize ?? 10,
        fontColor: layout.elements?.allergensList?.fontColor ?? "#888888",
        fontStyle: layout.elements?.allergensList?.fontStyle ?? "normal",
        alignment: layout.elements?.allergensList?.alignment ?? "left",
        margin: {
          top: layout.elements?.allergensList?.margin?.top ?? 0,
          right: layout.elements?.allergensList?.margin?.right ?? 0,
          bottom: layout.elements?.allergensList?.margin?.bottom ?? 0,
          left: layout.elements?.allergensList?.margin?.left ?? 0,
        },
        visible: typeof layout.elements?.allergensList?.visible === "boolean" ? layout.elements?.allergensList?.visible : true,
      },
      price: {
        ...layout.elements?.price,
        fontFamily: layout.elements?.price?.fontFamily ?? "Arial",
        fontSize: layout.elements?.price?.fontSize ?? 16,
        fontColor: layout.elements?.price?.fontColor ?? "#222222",
        fontStyle: layout.elements?.price?.fontStyle ?? "bold",
        alignment: layout.elements?.price?.alignment ?? "right",
        margin: {
          top: layout.elements?.price?.margin?.top ?? 0,
          right: layout.elements?.price?.margin?.right ?? 0,
          bottom: layout.elements?.price?.margin?.bottom ?? 0,
          left: layout.elements?.price?.margin?.left ?? 0,
        },
        visible: typeof layout.elements?.price?.visible === "boolean" ? layout.elements?.price?.visible : true,
      },
      suffix: {
        ...layout.elements?.suffix,
        fontFamily: layout.elements?.suffix?.fontFamily ?? "Arial",
        fontSize: layout.elements?.suffix?.fontSize ?? 12,
        fontColor: layout.elements?.suffix?.fontColor ?? "#444444",
        fontStyle: layout.elements?.suffix?.fontStyle ?? "normal",
        alignment: layout.elements?.suffix?.alignment ?? "right",
        visible: typeof layout.elements?.suffix?.visible === "boolean" ? layout.elements?.suffix?.visible : true,
      },
      priceVariants: {
        ...layout.elements?.priceVariants,
        fontFamily: layout.elements?.priceVariants?.fontFamily ?? "Arial",
        fontSize: layout.elements?.priceVariants?.fontSize ?? 10,
        fontColor: layout.elements?.priceVariants?.fontColor ?? "#888888",
        fontStyle: layout.elements?.priceVariants?.fontStyle ?? "italic",
        alignment: layout.elements?.priceVariants?.alignment ?? "right",
        margin: {
          top: layout.elements?.priceVariants?.margin?.top ?? 0,
          right: layout.elements?.priceVariants?.margin?.right ?? 0,
          bottom: layout.elements?.priceVariants?.margin?.bottom ?? 0,
          left: layout.elements?.priceVariants?.margin?.left ?? 0,
        },
        visible: typeof layout.elements?.priceVariants?.visible === "boolean" ? layout.elements?.priceVariants?.visible : true,
      },
    },

    cover: {
      logo: {
        ...layout.cover?.logo,
        imageUrl: layout.cover?.logo?.imageUrl ?? "",
        maxWidth: layout.cover?.logo?.maxWidth ?? 80,
        maxHeight: layout.cover?.logo?.maxHeight ?? 50,
        alignment: layout.cover?.logo?.alignment ?? "center",
        marginTop: layout.cover?.logo?.marginTop ?? 20,
        marginBottom: layout.cover?.logo?.marginBottom ?? 20,
        visible: typeof layout.cover?.logo?.visible === "boolean" ? layout.cover?.logo?.visible : true,
      },
      title: {
        ...layout.cover?.title,
        menuTitle: typeof layout.cover?.title?.menuTitle === "string" ? layout.cover?.title?.menuTitle : "",
        fontFamily: layout.cover?.title?.fontFamily ?? "Arial",
        fontSize: layout.cover?.title?.fontSize ?? 24,
        fontColor: layout.cover?.title?.fontColor ?? "#000000",
        fontStyle: layout.cover?.title?.fontStyle ?? "bold",
        alignment: layout.cover?.title?.alignment ?? "center",
        margin: {
          top: layout.cover?.title?.margin?.top ?? 20,
          right: layout.cover?.title?.margin?.right ?? 0,
          bottom: layout.cover?.title?.margin?.bottom ?? 10,
          left: layout.cover?.title?.margin?.left ?? 0,
        },
        visible: typeof layout.cover?.title?.visible === "boolean" ? layout.cover?.title?.visible : true,
      },
      subtitle: {
        ...layout.cover?.subtitle,
        menuSubtitle: typeof layout.cover?.subtitle?.menuSubtitle === "string" ? layout.cover?.subtitle?.menuSubtitle : "",
        fontFamily: layout.cover?.subtitle?.fontFamily ?? "Arial",
        fontSize: layout.cover?.subtitle?.fontSize ?? 14,
        fontColor: layout.cover?.subtitle?.fontColor ?? "#666666",
        fontStyle: layout.cover?.subtitle?.fontStyle ?? "italic",
        alignment: layout.cover?.subtitle?.alignment ?? "center",
        margin: {
          top: layout.cover?.subtitle?.margin?.top ?? 5,
          right: layout.cover?.subtitle?.margin?.right ?? 0,
          bottom: layout.cover?.subtitle?.margin?.bottom ?? 0,
          left: layout.cover?.subtitle?.margin?.left ?? 0,
        },
        visible: typeof layout.cover?.subtitle?.visible === "boolean" ? layout.cover?.subtitle?.visible : true,
      }
    },

    allergens: {
      ...layout.allergens,
      title: {
        ...layout.allergens?.title,
        fontFamily: layout.allergens?.title?.fontFamily ?? "Arial",
        fontSize: layout.allergens?.title?.fontSize ?? 18,
        fontColor: layout.allergens?.title?.fontColor ?? "#222222",
        fontStyle: layout.allergens?.title?.fontStyle ?? "bold",
        alignment: layout.allergens?.title?.alignment ?? "center",
        margin: {
          top: layout.allergens?.title?.margin?.top ?? 12,
          right: layout.allergens?.title?.margin?.right ?? 0,
          bottom: layout.allergens?.title?.margin?.bottom ?? 10,
          left: layout.allergens?.title?.margin?.left ?? 0,
        },
        visible: typeof layout.allergens?.title?.visible === "boolean" ? layout.allergens?.title?.visible : true,
      },
      description: {
        ...layout.allergens?.description,
        fontFamily: layout.allergens?.description?.fontFamily ?? "Arial",
        fontSize: layout.allergens?.description?.fontSize ?? 12,
        fontColor: layout.allergens?.description?.fontColor ?? "#444444",
        fontStyle: layout.allergens?.description?.fontStyle ?? "italic",
        alignment: layout.allergens?.description?.alignment ?? "center",
        margin: {
          top: layout.allergens?.description?.margin?.top ?? 0,
          right: layout.allergens?.description?.margin?.right ?? 0,
          bottom: layout.allergens?.description?.margin?.bottom ?? 12,
          left: layout.allergens?.description?.margin?.left ?? 0,
        },
        visible: typeof layout.allergens?.description?.visible === "boolean" ? layout.allergens?.description?.visible : true,
      },
      item: {
        ...layout.allergens?.item,
        number: {
          ...layout.allergens?.item?.number,
          fontFamily: layout.allergens?.item?.number?.fontFamily ?? "Arial",
          fontSize: layout.allergens?.item?.number?.fontSize ?? 12,
          fontColor: layout.allergens?.item?.number?.fontColor ?? "#888888",
          fontStyle: layout.allergens?.item?.number?.fontStyle ?? "bold",
          alignment: layout.allergens?.item?.number?.alignment ?? "left",
          margin: {
            top: layout.allergens?.item?.number?.margin?.top ?? 0,
            right: layout.allergens?.item?.number?.margin?.right ?? 0,
            bottom: layout.allergens?.item?.number?.margin?.bottom ?? 0,
            left: layout.allergens?.item?.number?.margin?.left ?? 0,
          },
          visible: typeof layout.allergens?.item?.number?.visible === "boolean" ? layout.allergens?.item?.number?.visible : true,
        },
        title: {
          ...layout.allergens?.item?.title,
          fontFamily: layout.allergens?.item?.title?.fontFamily ?? "Arial",
          fontSize: layout.allergens?.item?.title?.fontSize ?? 12,
          fontColor: layout.allergens?.item?.title?.fontColor ?? "#222222",
          fontStyle: layout.allergens?.item?.title?.fontStyle ?? "bold",
          alignment: layout.allergens?.item?.title?.alignment ?? "left",
          margin: {
            top: layout.allergens?.item?.title?.margin?.top ?? 0,
            right: layout.allergens?.item?.title?.margin?.right ?? 0,
            bottom: layout.allergens?.item?.title?.margin?.bottom ?? 0,
            left: layout.allergens?.item?.title?.margin?.left ?? 0,
          },
          visible: typeof layout.allergens?.item?.title?.visible === "boolean" ? layout.allergens?.item?.title?.visible : true,
        },
        description: {
          ...layout.allergens?.item?.description,
          fontFamily: layout.allergens?.item?.description?.fontFamily ?? "Arial",
          fontSize: layout.allergens?.item?.description?.fontSize ?? 10,
          fontColor: layout.allergens?.item?.description?.fontColor ?? "#666666",
          fontStyle: layout.allergens?.item?.description?.fontStyle ?? "normal",
          alignment: layout.allergens?.item?.description?.alignment ?? "left",
          margin: {
            top: layout.allergens?.item?.description?.margin?.top ?? 0,
            right: layout.allergens?.item?.description?.margin?.right ?? 0,
            bottom: layout.allergens?.item?.description?.margin?.bottom ?? 0,
            left: layout.allergens?.item?.description?.margin?.left ?? 0,
          },
          visible: typeof layout.allergens?.item?.description?.visible === "boolean" ? layout.allergens?.item?.description?.visible : true,
        },
        spacing: layout.allergens?.item?.spacing ?? 8,
        backgroundColor: layout.allergens?.item?.backgroundColor ?? "#FFFFFF",
        borderRadius: typeof layout.allergens?.item?.borderRadius === "number" ? layout.allergens?.item?.borderRadius : 0,
        padding: typeof layout.allergens?.item?.padding === "number" ? layout.allergens?.item?.padding : 0,
        iconSize: typeof layout.allergens?.item?.iconSize === "number" ? layout.allergens?.item?.iconSize : 16,
      },
    },

    spacing: {
      ...layout.spacing,
      betweenCategories: layout.spacing?.betweenCategories ?? 10,
      betweenProducts: layout.spacing?.betweenProducts ?? 4,
      categoryTitleBottomMargin: layout.spacing?.categoryTitleBottomMargin ?? 6,
    },

    page: {
      ...layout.page,
      marginTop: layout.page?.marginTop ?? 16,
      marginRight: layout.page?.marginRight ?? 6,
      marginBottom: layout.page?.marginBottom ?? 16,
      marginLeft: layout.page?.marginLeft ?? 6,
      useDistinctMarginsForPages: typeof layout.page?.useDistinctMarginsForPages === "boolean" ? layout.page?.useDistinctMarginsForPages : false,
      oddPages: {
        marginTop: layout.page?.oddPages?.marginTop ?? 16,
        marginRight: layout.page?.oddPages?.marginRight ?? 6,
        marginBottom: layout.page?.oddPages?.marginBottom ?? 16,
        marginLeft: layout.page?.oddPages?.marginLeft ?? 6,
      },
      evenPages: {
        marginTop: layout.page?.evenPages?.marginTop ?? 16,
        marginRight: layout.page?.evenPages?.marginRight ?? 6,
        marginBottom: layout.page?.evenPages?.marginBottom ?? 16,
        marginLeft: layout.page?.evenPages?.marginLeft ?? 6,
      },
    },
  };
}

export function useLayoutEditor(initialLayout: PrintLayout, onSave: (layout: PrintLayout) => void) {
  const [editedLayout, setEditedLayout] = useState<PrintLayout>(ensureAllFields(initialLayout));
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
    // Garantisco che tutti i campi siano presenti e normalizzati PRIMA DEL SALVATAGGIO!
    const finalLayout = ensureAllFields(syncPageMargins(editedLayout));
    onSave(finalLayout); // questo passerà la struttura JSON completa con tutti i valori a Supabase!
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
