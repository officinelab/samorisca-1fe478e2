
import { PrintLayout } from "@/types/printLayout";

/**
 * Ensures that page margins are synchronized correctly
 * When useDistinctMarginsForPages is false, odd and even pages should have the same margins as the main margins
 */
export const syncPageMargins = (layout: PrintLayout): PrintLayout => {
  // Shallow clone to avoid mutating the original
  const syncedLayout = { ...layout };
  
  // Ensure oddPages and evenPages are initialized
  if (!syncedLayout.page.oddPages) {
    syncedLayout.page.oddPages = {
      marginTop: syncedLayout.page.marginTop,
      marginRight: syncedLayout.page.marginRight,
      marginBottom: syncedLayout.page.marginBottom,
      marginLeft: syncedLayout.page.marginLeft
    };
  }
  
  if (!syncedLayout.page.evenPages) {
    syncedLayout.page.evenPages = {
      marginTop: syncedLayout.page.marginTop,
      marginRight: syncedLayout.page.marginRight,
      marginBottom: syncedLayout.page.marginBottom,
      marginLeft: syncedLayout.page.marginLeft
    };
  }
  
  // If not using distinct margins, sync odd and even to main margins
  if (!syncedLayout.page.useDistinctMarginsForPages) {
    syncedLayout.page.oddPages = {
      marginTop: syncedLayout.page.marginTop,
      marginRight: syncedLayout.page.marginRight,
      marginBottom: syncedLayout.page.marginBottom,
      marginLeft: syncedLayout.page.marginLeft
    };
    
    syncedLayout.page.evenPages = {
      marginTop: syncedLayout.page.marginTop,
      marginRight: syncedLayout.page.marginRight,
      marginBottom: syncedLayout.page.marginBottom,
      marginLeft: syncedLayout.page.marginLeft
    };
  }
  
  // Ensure cover settings exist and always set all fields for logo, title, subtitle
  if (!syncedLayout.cover) {
    syncedLayout.cover = {
      logo: {
        imageUrl: "",
        maxWidth: 80,
        maxHeight: 50,
        alignment: 'center',
        marginTop: 20,
        marginBottom: 20,
        visible: true
      },
      title: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 24,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 20, right: 0, bottom: 10, left: 0 },
        menuTitle: ""
      },
      subtitle: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "center",
        margin: { top: 5, right: 0, bottom: 0, left: 0 },
        menuSubtitle: ""
      }
    };
  } else {
    // Ensure all fields present (fallback)
    const logo = syncedLayout.cover.logo || {};
    syncedLayout.cover.logo = {
      imageUrl: logo.imageUrl ?? "",
      maxWidth: logo.maxWidth ?? 80,
      maxHeight: logo.maxHeight ?? 50,
      alignment: logo.alignment ?? 'center',
      marginTop: logo.marginTop ?? 20,
      marginBottom: logo.marginBottom ?? 20,
      visible: typeof logo.visible === "boolean" ? logo.visible : true,
    };
    const title = syncedLayout.cover.title || {};
    syncedLayout.cover.title = {
      fontFamily: title.fontFamily ?? "Arial",
      fontSize: title.fontSize ?? 24,
      fontColor: title.fontColor ?? "#000000",
      fontStyle: title.fontStyle ?? "bold",
      alignment: title.alignment ?? "center",
      margin: title.margin ?? { top: 20, right: 0, bottom: 10, left: 0 },
      menuTitle: title.menuTitle ?? "",
      visible: typeof title.visible === "boolean" ? title.visible : true,
    };
    const subtitle = syncedLayout.cover.subtitle || {};
    syncedLayout.cover.subtitle = {
      fontFamily: subtitle.fontFamily ?? "Arial",
      fontSize: subtitle.fontSize ?? 14,
      fontColor: subtitle.fontColor ?? "#666666",
      fontStyle: subtitle.fontStyle ?? "italic",
      alignment: subtitle.alignment ?? "center",
      margin: subtitle.margin ?? { top: 5, right: 0, bottom: 0, left: 0 },
      menuSubtitle: subtitle.menuSubtitle ?? "",
      visible: typeof subtitle.visible === "boolean" ? subtitle.visible : true,
    };
  }
  
  // Ensure allergens settings exist, including item.description
  if (!syncedLayout.allergens) {
    syncedLayout.allergens = {
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
        description: {
          visible: true,
          fontFamily: "Arial",
          fontSize: 12,
          fontColor: "#444444",
          fontStyle: "normal",
          alignment: "left",
          margin: { top: 0, right: 0, bottom: 5, left: 0 }
        },
        spacing: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 4,
        padding: 8
      }
    };
  } else {
    const item = syncedLayout.allergens.item || {};
    syncedLayout.allergens.item = {
      ...item,
      description: {
        fontFamily: item.description?.fontFamily ?? "Arial",
        fontSize: item.description?.fontSize ?? 12,
        fontColor: item.description?.fontColor ?? "#444444",
        fontStyle: item.description?.fontStyle ?? "normal",
        alignment: item.description?.alignment ?? "left",
        margin: item.description?.margin ?? { top: 0, right: 0, bottom: 5, left: 0 },
        visible: typeof item.description?.visible === "boolean" ? item.description.visible : true,
      }
    };
  }
  
  return syncedLayout;
};
