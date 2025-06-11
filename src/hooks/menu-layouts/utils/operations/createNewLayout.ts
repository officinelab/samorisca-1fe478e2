import { PrintLayout } from "@/types/printLayout";
import { generateId } from "./idGenerator";

export const createNewLayout = (name: string): PrintLayout => ({
  id: generateId(),
  name: name,
  type: 'custom',
  isDefault: false,
  productSchema: 'schema1',
  elements: {
    category: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 5, right: 5, bottom: 5, left: 5 }
    },
    title: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 18,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 5, right: 5, bottom: 5, left: 5 }
    },
    description: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#666666",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 5, right: 5, bottom: 5, left: 5 }
    },
    descriptionEng: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#666666",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 5, right: 5, bottom: 5, left: 5 }
    },
    allergensList: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 10,
      fontColor: "#999999",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 2, right: 2, bottom: 2, left: 2 }
    },
    productFeatures: {
      iconSize: 16,
      iconSpacing: 8,
      marginTop: 4,
      marginBottom: 4
    },
    price: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#007700",
      fontStyle: "bold",
      alignment: "right",
      margin: { top: 5, right: 5, bottom: 5, left: 5 }
    },
    suffix: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 10,
      fontColor: "#007700",
      fontStyle: "normal",
      alignment: "left"
    },
    priceVariants: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 2, right: 2, bottom: 2, left: 2 }
    }
  },
  cover: {
    logo: {
      imageUrl: "",
      maxWidth: 80,
      maxHeight: 50,
      alignment: "center",
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
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#FF0000",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 10, right: 0, bottom: 5, left: 0 }
    },
    description: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 10, left: 0 }
    },
    item: {
      number: {
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#FFFFFF",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 0, right: 5, bottom: 0, left: 5 }
      },
      title: {
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 5, left: 0 }
      },
      description: {
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#666666",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      spacing: 2,
      backgroundColor: "#F0F0F0",
      borderRadius: 5,
      padding: 5,
      iconSize: 16
    }
  },
  categoryNotes: {
    icon: {
      iconSize: 16
    },
    title: {
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 2, left: 0 }
    },
    text: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    }
  },
  productFeatures: {
    icon: {
      iconSize: 16
    },
    title: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#000000",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    }
  },
  spacing: {
    betweenCategories: 20,
    betweenProducts: 10,
    categoryTitleBottomMargin: 5
  },
  page: {
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 10,
    useDistinctMarginsForPages: false,
    oddPages: {
      marginTop: 10,
      marginRight: 10,
      marginBottom: 10,
      marginLeft: 10
    },
    evenPages: {
      marginTop: 10,
      marginRight: 10,
      marginBottom: 10,
      marginLeft: 10
    }
  }
});
