import { PrintLayout } from "@/types/printLayout";
import { v4 as uuidv4 } from "uuid";

/**
 * Creates a new layout with default values and the given name
 * @param name The name of the new layout
 * @param existingLayouts Optional parameter for compatibility with cloning and migration
 */
export const createNewLayoutFromTemplate = (name: string, existingLayouts?: PrintLayout[]): PrintLayout => {
  return {
    id: uuidv4(),
    name,
    type: 'custom',
    isDefault: false,
    productSchema: 'schema1',
    elements: {
      category: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 18,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 5, left: 0 }
      },
      title: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#000000",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 2, left: 0 }
      },
      description: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#666666",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 5, left: 0 }
      },
      descriptionEng: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#666666",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 5, left: 0 }
      },
      price: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "right",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      allergensList: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#888888",
        fontStyle: "italic",
        alignment: "left",
        margin: { top: 2, right: 0, bottom: 0, left: 0 }
      },
      productFeatures: {
        iconSize: 16,
        iconSpacing: 8,
        marginTop: 4,
        marginBottom: 4
      },
      priceVariants: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#000000",
        fontStyle: "normal",
        alignment: "right",
        margin: { top: 2, right: 0, bottom: 0, left: 0 }
      },
      suffix: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#000000",
        fontStyle: "normal",
        alignment: "right"
      }
    },
    spacing: {
      betweenCategories: 15,
      betweenProducts: 10,
      categoryTitleBottomMargin: 5
    },
    page: {
      marginTop: 20,
      marginRight: 15,
      marginBottom: 20,
      marginLeft: 15,
      useDistinctMarginsForPages: false,
      oddPages: {
        marginTop: 20,
        marginRight: 15,
        marginBottom: 20,
        marginLeft: 15
      },
      evenPages: {
        marginTop: 20,
        marginRight: 15,
        marginBottom: 20,
        marginLeft: 15
      }
    },
    cover: {
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
    },
    allergens: {
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
        padding: 8,
        iconSize: 16
      }
    }
  };
};
