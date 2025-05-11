
import { PrintLayout } from "@/types/printLayout";

export const classicLayout: PrintLayout = {
  id: "classic",
  name: "Layout Classico",
  type: "classic",
  isDefault: true,
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
      fontSize: 12,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 2, left: 0 }
    },
    description: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 10,
      fontColor: "#333333",
      fontStyle: "italic",
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
      fontSize: 10,
      fontColor: "#555555",
      fontStyle: "normal",
      alignment: "center",
      margin: { top: 0, right: 10, bottom: 0, left: 0 }
    },
    priceVariants: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 10,
      fontColor: "#000000",
      fontStyle: "normal",
      alignment: "right",
      margin: { top: 1, right: 0, bottom: 0, left: 0 }
    }
  },
  spacing: {
    betweenCategories: 15,
    betweenProducts: 5,
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
  }
};
