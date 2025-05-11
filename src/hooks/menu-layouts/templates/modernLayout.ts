
import { PrintLayout } from "@/types/printLayout";

export const modernLayout: PrintLayout = {
  id: "modern",
  name: "Layout Moderno",
  type: "modern",
  isDefault: false,
  elements: {
    category: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 20,
      fontColor: "#222222",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 8, left: 0 }
    },
    title: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 14,
      fontColor: "#444444",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 3, left: 0 }
    },
    description: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 11,
      fontColor: "#666666",
      fontStyle: "italic",
      alignment: "left",
      margin: { top: 3, right: 0, bottom: 0, left: 0 }
    },
    price: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 14,
      fontColor: "#222222",
      fontStyle: "bold",
      alignment: "right",
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    allergensList: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 10,
      fontColor: "#777777",
      fontStyle: "normal",
      alignment: "center",
      margin: { top: 0, right: 10, bottom: 0, left: 0 }
    },
    priceVariants: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 11,
      fontColor: "#444444",
      fontStyle: "normal",
      alignment: "right",
      margin: { top: 2, right: 0, bottom: 0, left: 0 }
    }
  },
  spacing: {
    betweenCategories: 20,
    betweenProducts: 7,
    categoryTitleBottomMargin: 8
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
      marginLeft: 20
    },
    evenPages: {
      marginTop: 25,
      marginRight: 20,
      marginBottom: 25,
      marginLeft: 20
    }
  }
};
