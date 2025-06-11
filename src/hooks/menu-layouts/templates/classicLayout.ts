import { PrintLayout } from "@/types/printLayout";

export const classicLayout: PrintLayout = {
  id: "classic",
  name: "Layout Classico",
  type: "classic",
  isDefault: true,
  productSchema: 'schema1',
  elements: {
    category: {
      fontFamily: "Arial",
      fontSize: 18,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 5, left: 0 }
    },
    title: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 2, left: 0 }
    },
    description: {
      fontFamily: "Arial",
      fontSize: 10,
      fontColor: "#333333",
      fontStyle: "italic",
      alignment: "left",
      margin: { top: 2, right: 0, bottom: 0, left: 0 }
    },
    descriptionEng: {
      fontFamily: "Arial",
      fontSize: 10,
      fontColor: "#333333",
      fontStyle: "italic",
      alignment: "left",
      margin: { top: 2, right: 0, bottom: 0, left: 0 },
      visible: true
    },
    price: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "right",
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    allergensList: {
      fontFamily: "Arial",
      fontSize: 10,
      fontColor: "#555555",
      fontStyle: "normal",
      alignment: "center",
      margin: { top: 0, right: 10, bottom: 0, left: 0 }
    },
    productFeatures: {
      iconSize: 16,
      iconSpacing: 8,
      marginTop: 4,
      marginBottom: 4
    },
    priceVariants: {
      fontFamily: "Arial",
      fontSize: 10,
      fontColor: "#000000",
      fontStyle: "normal",
      alignment: "right",
      margin: { top: 1, right: 0, bottom: 0, left: 0 }
    },
    suffix: {
      fontFamily: "Arial",
      fontSize: 9,
      fontColor: "#888888",
      fontStyle: "normal",
      alignment: "left"
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
  },
  cover: {
    logo: {
      imageUrl: null,
      maxWidth: 80,
      maxHeight: 50,
      alignment: 'center',
      marginTop: 20,
      marginBottom: 20,
      visible: true
    },
    title: {
      menuTitle: undefined,
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 26,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 20, right: 0, bottom: 10, left: 0 }
    },
    subtitle: {
      menuSubtitle: undefined,
      visible: true,
      fontFamily: "Times New Roman",
      fontSize: 16,
      fontColor: "#666666",
      fontStyle: "italic",
      alignment: "center",
      margin: { top: 5, right: 0, bottom: 0, left: 0 }
    }
  },
  allergens: {
    title: {
      fontFamily: "Times New Roman",
      fontSize: 22,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 15, left: 0 }
    },
    description: {
      fontFamily: "Times New Roman",
      fontSize: 14,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 15, left: 0 }
    },
    item: {
      number: {
        fontFamily: "Times New Roman",
        fontSize: 14,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 8, bottom: 0, left: 0 }
      },
      title: {
        fontFamily: "Times New Roman",
        fontSize: 14,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      description: {
        fontFamily: "Times New Roman",
        fontSize: 12,
        fontColor: "#444444",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      spacing: 10,
      backgroundColor: "#f5f5f5",
      borderRadius: 0,
      padding: 5,
      iconSize: 16
    }
  },
  categoryNotes: {
    icon: {
      iconSize: 16
    },
    title: {
      fontFamily: "Times New Roman",
      fontSize: 14,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 2, left: 0 },
      visible: true
    },
    text: {
      fontFamily: "Times New Roman",
      fontSize: 12,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      visible: true
    }
  }
};
