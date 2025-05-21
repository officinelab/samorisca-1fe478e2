
import { PrintLayout } from "@/types/printLayout";

// Classic layout - Schema 1 (layout originale)
export const classicLayoutSchema1: PrintLayout = {
  id: "classic-schema1",
  name: "Classico - Schema 1",
  type: "classic",
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
      margin: { top: 0, right: 0, bottom: 5, left: 0 },
    },
    title: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 14,
      fontColor: "#000000",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 2, left: 0 },
    },
    description: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 12,
      fontColor: "#666666",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 5, left: 0 },
    },
    price: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 14,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "right",
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    allergensList: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 10,
      fontColor: "#888888",
      fontStyle: "italic",
      alignment: "left",
      margin: { top: 2, right: 0, bottom: 0, left: 0 },
    },
    priceVariants: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 12,
      fontColor: "#000000",
      fontStyle: "normal",
      alignment: "right",
      margin: { top: 2, right: 0, bottom: 0, left: 0 },
    },
    suffix: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 12,
      fontColor: "#000000",
      fontStyle: "normal",
      alignment: "right"
    }
  },
  spacing: {
    betweenCategories: 15,
    betweenProducts: 10,
    categoryTitleBottomMargin: 5,
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
      marginLeft: 15,
    },
    evenPages: {
      marginTop: 20,
      marginRight: 15,
      marginBottom: 20,
      marginLeft: 15,
    },
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
      fontFamily: "Times New Roman",
      fontSize: 26,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 20, right: 0, bottom: 10, left: 0 },
      menuTitle: "Il Nostro Menu"
    },
    subtitle: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 16,
      fontColor: "#666666",
      fontStyle: "italic",
      alignment: "center",
      margin: { top: 5, right: 0, bottom: 0, left: 0 },
      menuSubtitle: "Estate 2025"
    }
  },
  allergens: {
    title: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 22,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 15, left: 0 }
    },
    description: {
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 14,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 15, left: 0 }
    },
    item: {
      number: {
        visible: true,
        fontFamily: "Times New Roman",
        fontSize: 14,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 8, bottom: 0, left: 0 }
      },
      title: {
        visible: true,
        fontFamily: "Times New Roman",
        fontSize: 14,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      description: {
        visible: true,
        fontFamily: "Times New Roman",
        fontSize: 12,
        fontColor: "#444444",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 5, left: 0 }
      },
      spacing: 10,
      backgroundColor: "#f5f5f5",
      borderRadius: 0,
      padding: 5
    }
  }
};
