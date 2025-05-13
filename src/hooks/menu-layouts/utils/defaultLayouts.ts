
import { PrintLayout } from "@/types/printLayout";
import { v4 as uuidv4 } from "uuid";

/**
 * Default layouts available for menu printing
 */
export const defaultLayouts: PrintLayout[] = [
  {
    id: uuidv4(),
    name: "Layout Classico",
    type: "classic",
    description: "Layout standard con titoli e prezzi",
    isDefault: true,
    productSchema: "schema1",
    elements: {
      category: {
        visible: true,
        fontFamily: "Times New Roman",
        fontSize: 18,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 5, right: 0, bottom: 5, left: 0 }
      },
      title: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      description: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#666666",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 2, right: 0, bottom: 0, left: 0 }
      },
      price: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "right",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      allergensList: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 9,
        fontColor: "#777777",
        fontStyle: "normal",
        alignment: "right",
        margin: { top: 0, right: 5, bottom: 0, left: 0 }
      }
    },
    spacing: {
      betweenCategories: 20,
      betweenProducts: 8,
      categoryTitleBottomMargin: 8
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
        marginLeft: 20
      },
      evenPages: {
        marginTop: 20,
        marginRight: 20,
        marginBottom: 20,
        marginLeft: 15
      }
    },
    cover: {
      logo: {
        width: 60,
        position: "center"
      },
      title: {
        visible: true,
        fontFamily: "Times New Roman",
        fontSize: 28,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 20, right: 0, bottom: 10, left: 0 }
      },
      subtitle: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 16,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "center",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      }
    },
    allergens: {
      title: {
        visible: true,
        fontFamily: "Times New Roman",
        fontSize: 18,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 10, right: 0, bottom: 10, left: 0 }
      },
      description: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 11,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "center",
        margin: { top: 0, right: 0, bottom: 15, left: 0 }
      },
      item: {
        columns: 2,
        number: {
          visible: true,
          fontFamily: "Arial",
          fontSize: 12,
          fontColor: "#000000",
          fontStyle: "bold",
          alignment: "center",
          margin: { top: 0, right: 10, bottom: 0, left: 0 }
        },
        title: {
          visible: true,
          fontFamily: "Arial",
          fontSize: 12,
          fontColor: "#000000",
          fontStyle: "normal",
          alignment: "left",
          margin: { top: 0, right: 0, bottom: 0, left: 0 }
        }
      }
    }
  },
  {
    id: uuidv4(),
    name: "Layout Moderno",
    type: "modern",
    description: "Layout moderno con stile minimalista",
    isDefault: false,
    productSchema: "schema1",
    elements: {
      category: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 20,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 8, right: 0, bottom: 8, left: 0 }
      },
      title: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 14,
        fontColor: "#000000",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      description: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 12,
        fontColor: "#666666",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 3, right: 0, bottom: 0, left: 0 }
      },
      price: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 14,
        fontColor: "#000000",
        fontStyle: "normal",
        alignment: "right",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      allergensList: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 10,
        fontColor: "#999999",
        fontStyle: "normal",
        alignment: "right",
        margin: { top: 0, right: 5, bottom: 0, left: 0 }
      }
    },
    spacing: {
      betweenCategories: 25,
      betweenProducts: 10,
      categoryTitleBottomMargin: 10
    },
    page: {
      marginTop: 25,
      marginRight: 20,
      marginBottom: 25,
      marginLeft: 20,
      useDistinctMarginsForPages: false,
      oddPages: {
        marginTop: 25,
        marginRight: 20,
        marginBottom: 25,
        marginLeft: 25
      },
      evenPages: {
        marginTop: 25,
        marginRight: 25,
        marginBottom: 25,
        marginLeft: 20
      }
    },
    cover: {
      logo: {
        width: 70,
        position: "center"
      },
      title: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 32,
        fontColor: "#000000",
        fontStyle: "normal",
        alignment: "center",
        margin: { top: 30, right: 0, bottom: 15, left: 0 }
      },
      subtitle: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 18,
        fontColor: "#666666",
        fontStyle: "normal",
        alignment: "center",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      }
    },
    allergens: {
      title: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 22,
        fontColor: "#000000",
        fontStyle: "normal",
        alignment: "center",
        margin: { top: 15, right: 0, bottom: 15, left: 0 }
      },
      description: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 12,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "center",
        margin: { top: 0, right: 0, bottom: 20, left: 0 }
      },
      item: {
        columns: 2,
        number: {
          visible: true,
          fontFamily: "Helvetica",
          fontSize: 14,
          fontColor: "#000000",
          fontStyle: "bold",
          alignment: "center",
          margin: { top: 0, right: 10, bottom: 0, left: 0 }
        },
        title: {
          visible: true,
          fontFamily: "Helvetica",
          fontSize: 14,
          fontColor: "#000000",
          fontStyle: "normal",
          alignment: "left",
          margin: { top: 0, right: 0, bottom: 0, left: 0 }
        }
      }
    }
  }
];
