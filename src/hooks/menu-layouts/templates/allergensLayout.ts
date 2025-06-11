import { PrintLayout } from "@/types/printLayout";

export const allergensLayout: PrintLayout = {
  id: 'allergens-layout',
  name: 'Layout Allergeni',
  type: 'custom',
  isDefault: false,
  productSchema: 'schema1',
  elements: {
    category: {
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 5, right: 0, bottom: 5, left: 0 }
    },
    title: {
      fontFamily: "Arial",
      fontSize: 18,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 10, right: 0, bottom: 5, left: 0 }
    },
    description: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#666666",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 10, left: 0 }
    },
    descriptionEng: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#666666",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 10, left: 0 }
    },
    allergensList: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#000000",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 5, left: 0 }
    },
    productFeatures: {
      iconSize: 16,
      iconSpacing: 8,
      marginTop: 4,
      marginBottom: 4
    },
    price: {
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#0077CC",
      fontStyle: "bold",
      alignment: "right",
      margin: { top: 0, right: 0, bottom: 0, left: 5 }
    },
    suffix: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#0077CC",
      fontStyle: "normal",
      alignment: "left"
    },
    priceVariants: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#999999",
      fontStyle: "italic",
      alignment: "right",
      margin: { top: 0, right: 0, bottom: 0, left: 5 }
    }
  },
  cover: {
    logo: {
      imageUrl: null,
      maxWidth: 80,
      maxHeight: 50,
      alignment: "center",
      marginTop: 20,
      marginBottom: 20,
      visible: true
    },
    title: {
      fontFamily: "Arial",
      fontSize: 24,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 20, right: 0, bottom: 10, left: 0 },
      menuTitle: ""
    },
    subtitle: {
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
      fontSize: 20,
      fontColor: "#222222",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 15, right: 0, bottom: 10, left: 0 }
    },
    description: {
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#444444",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 15, left: 0 }
    },
    item: {
      number: {
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#FFFFFF",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      title: {
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 5, left: 5 }
      },
      description: {
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#444444",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 5, left: 0 }
      },
      spacing: 8,
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
    betweenCategories: 15,
    betweenProducts: 10,
    categoryTitleBottomMargin: 5
  },
  page: {
    marginTop: 15,
    marginRight: 15,
    marginBottom: 15,
    marginLeft: 15,
    useDistinctMarginsForPages: false,
    oddPages: {
      marginTop: 15,
      marginRight: 15,
      marginBottom: 15,
      marginLeft: 15
    },
    evenPages: {
      marginTop: 15,
      marginRight: 15,
      marginBottom: 15,
      marginLeft: 15
    }
  }
};
