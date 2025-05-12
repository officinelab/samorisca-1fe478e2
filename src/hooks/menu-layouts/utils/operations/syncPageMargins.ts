
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
  
  // Ensure cover settings exist
  if (!syncedLayout.cover) {
    syncedLayout.cover = {
      logo: {
        maxWidth: 80,
        maxHeight: 50,
        alignment: 'center',
        marginTop: 20,
        marginBottom: 20,
        visible: true  // Aggiunto il campo visible
      },
      title: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 24,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 20, right: 0, bottom: 10, left: 0 }
      },
      subtitle: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "center",
        margin: { top: 5, right: 0, bottom: 0, left: 0 }
      }
    };
  } else if (syncedLayout.cover.logo && typeof syncedLayout.cover.logo.visible !== 'boolean') {
    // Assicuriamo che la proprietà visible esista nel logo
    syncedLayout.cover.logo.visible = true;
  }
  
  // Ensure allergens settings exist
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
        spacing: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 4,
        padding: 8
      }
    };
  }
  
  return syncedLayout;
};
