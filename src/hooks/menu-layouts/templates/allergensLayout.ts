
import { PrintLayout } from "@/types/printLayout";

export const allergensLayout: PrintLayout = {
  id: "allergens",
  name: "Solo Allergeni",
  type: "allergens",
  isDefault: false,
  elements: {
    category: {
      visible: false,
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 5, left: 0 }
    },
    title: {
      visible: false,
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#000000", 
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 2, left: 0 }
    },
    description: {
      visible: false,
      fontFamily: "Arial",
      fontSize: 10,
      fontColor: "#333333",
      fontStyle: "italic",
      alignment: "left",
      margin: { top: 2, right: 0, bottom: 0, left: 0 }
    },
    price: {
      visible: false,
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
      fontSize: 12,
      fontColor: "#000000",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 3, right: 0, bottom: 3, left: 0 }
    },
    priceVariants: {
      visible: false,
      fontFamily: "Arial",
      fontSize: 10,
      fontColor: "#000000",
      fontStyle: "normal",
      alignment: "right",
      margin: { top: 1, right: 0, bottom: 0, left: 0 }
    }
  },
  spacing: {
    betweenCategories: 10,
    betweenProducts: 4,
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
  // Aggiungiamo le sezioni mancanti
  cover: {
    logo: {
      maxWidth: 80,
      maxHeight: 50,
      alignment: 'center',
      marginTop: 20,
      marginBottom: 20
    },
    title: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 28,
      fontColor: "#ea384c",
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
      margin: { top: 5, right: 0, bottom: 0, left: 0 }
    }
  },
  allergens: {
    title: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 28,
      fontColor: "#ea384c",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 20, left: 0 }
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
        fontColor: "#FFFFFF",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 0, right: 10, bottom: 0, left: 0 }
      },
      title: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#333333",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      spacing: 12,
      backgroundColor: "#f9f9f9",
      borderRadius: 4,
      padding: 8
    }
  }
};
