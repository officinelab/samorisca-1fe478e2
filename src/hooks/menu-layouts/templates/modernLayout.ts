
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
      fontColor: "#1A1F2C",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 8, left: 0 }
    },
    title: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 16,
      fontColor: "#333333",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 3, left: 0 }
    },
    description: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 12,
      fontColor: "#555555",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 8, left: 0 }
    },
    price: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 16,
      fontColor: "#9b87f5",
      fontStyle: "bold",
      alignment: "right",
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    allergensList: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 10,
      fontColor: "#777777",
      fontStyle: "italic",
      alignment: "left",
      margin: { top: 3, right: 0, bottom: 0, left: 0 }
    },
    priceVariants: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 12,
      fontColor: "#555555",
      fontStyle: "normal",
      alignment: "right",
      margin: { top: 3, right: 0, bottom: 0, left: 0 }
    }
  },
  spacing: {
    betweenCategories: 25,
    betweenProducts: 15,
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
      marginLeft: 20
    },
    evenPages: {
      marginTop: 25,
      marginRight: 20,
      marginBottom: 25,
      marginLeft: 20
    }
  },
  // Aggiungiamo le sezioni mancanti con stile moderno
  cover: {
    logo: {
      maxWidth: 85,
      maxHeight: 60,
      alignment: 'center',
      marginTop: 30,
      marginBottom: 30
    },
    title: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 32,
      fontColor: "#1A1F2C",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 30, right: 0, bottom: 15, left: 0 }
    },
    subtitle: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 18,
      fontColor: "#555555",
      fontStyle: "italic",
      alignment: "center",
      margin: { top: 10, right: 0, bottom: 0, left: 0 }
    }
  },
  allergens: {
    title: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 24,
      fontColor: "#1A1F2C",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 20, left: 0 }
    },
    description: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 14,
      fontColor: "#555555",
      fontStyle: "normal",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 20, left: 0 }
    },
    item: {
      number: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 14,
        fontColor: "#FFFFFF",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 0, right: 12, bottom: 0, left: 0 }
      },
      title: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 14,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      spacing: 12,
      backgroundColor: "#F1F0FB",
      borderRadius: 6,
      padding: 10
    }
  }
};
