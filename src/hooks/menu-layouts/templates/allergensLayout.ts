import { PrintLayout } from "@/types/printLayout";

export const allergensLayout: PrintLayout = {
  id: "allergens-layout",
  name: "Layout Allergeni",
  type: "custom",
  isDefault: false,
  productSchema: "schema1",
  elements: {
    category: {
      fontFamily: "Arial",
      fontSize: 18,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 8, left: 0 }
    },
    title: {
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 4, left: 0 }
    },
    description: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 2, left: 0 }
    },
    descriptionEng: {
      fontFamily: "Arial",
      fontSize: 11,
      fontColor: "#666666",
      fontStyle: "italic",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 2, left: 0 }
    },
    allergensList: {
      fontFamily: "Arial",
      fontSize: 10,
      fontColor: "#888888",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 2, left: 0 }
    },
    productFeatures: {
      iconSize: 14,
      iconSpacing: 4,
      marginTop: 2,
      marginBottom: 2
    },
    price: {
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "right",
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    suffix: {
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "right"
    },
    priceVariants: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#666666",
      fontStyle: "normal",
      alignment: "right",
      margin: { top: 2, right: 0, bottom: 0, left: 0 }
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
        fontColor: "#666666",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      spacing: 10,
      backgroundColor: "#f9f9f9",
      borderRadius: 4,
      padding: 8,
      iconSize: 16
    }
  },
  categoryNotes: {
    icon: {
      iconSize: 16
    },
    title: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 2, left: 0 }
    },
    text: {
      visible: true,
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
      iconSize: 16,
      iconSpacing: 4,
      marginTop: 0,
      marginBottom: 0
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
  },
  servicePrice: {
    visible: true,
    fontFamily: "Arial",
    fontSize: 12,
    fontColor: "#000000",
    fontStyle: "normal",
    alignment: "left",
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  },
  spacing: {
    betweenCategories: 15,
    betweenProducts: 8,
    categoryTitleBottomMargin: 10
  },
  page: {
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,
    marginLeft: 20,
    useDistinctMarginsForPages: false,
    oddPages: {
      marginTop: 20,
      marginRight: 20,
      marginBottom: 20,
      marginLeft: 20
    },
    evenPages: {
      marginTop: 20,
      marginRight: 20,
      marginBottom: 20,
      marginLeft: 20
    },
    coverMarginTop: 25,
    coverMarginRight: 25,
    coverMarginBottom: 25,
    coverMarginLeft: 25,
    allergensMarginTop: 20,
    allergensMarginRight: 15,
    allergensMarginBottom: 20,
    allergensMarginLeft: 15,
    useDistinctMarginsForAllergensPages: false,
    allergensOddPages: {
      marginTop: 20,
      marginRight: 15,
      marginBottom: 20,
      marginLeft: 15
    },
    allergensEvenPages: {
      marginTop: 20,
      marginRight: 15,
      marginBottom: 20,
      marginLeft: 15
    }
  },
  pageBreaks: { categoryIds: [] }
};
