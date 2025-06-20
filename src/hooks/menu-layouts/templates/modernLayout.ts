import { PrintLayout } from "@/types/printLayout";

export const modernLayout: PrintLayout = {
  id: "modern-layout",
  name: "Layout Moderno",
  type: "custom",
  isDefault: false,
  productSchema: "schema1",
  elements: {
    category: {
      fontFamily: "Arial",
      fontSize: 20,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 12, left: 0 },
      visible: true
    },
    title: {
      fontFamily: "Arial",
      fontSize: 18,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 6, left: 0 },
      visible: true
    },
    description: {
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 4, left: 0 },
      visible: true
    },
    descriptionEng: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#666666",
      fontStyle: "italic",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 4, left: 0 },
      visible: true
    },
    allergensList: {
      fontFamily: "Arial",
      fontSize: 11,
      fontColor: "#888888",
      fontStyle: "normal",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 4, left: 0 },
      visible: true
    },
    productFeatures: {
      iconSize: 16,
      iconSpacing: 6,
      marginTop: 4,
      marginBottom: 4
    },
    price: {
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      visible: true
    },
    suffix: {
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "center",
      visible: true
    },
    priceVariants: {
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#666666",
      fontStyle: "normal",
      alignment: "center",
      margin: { top: 4, right: 0, bottom: 0, left: 0 },
      visible: true
    }
  },
  cover: {
    logo: {
      imageUrl: "",
      maxWidth: 60,
      maxHeight: 40,
      alignment: "center",
      marginTop: 30,
      marginBottom: 30,
      visible: true
    },
    title: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 28,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 25, right: 0, bottom: 15, left: 0 },
      menuTitle: ""
    },
    subtitle: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#666666",
      fontStyle: "italic",
      alignment: "center",
      margin: { top: 8, right: 0, bottom: 0, left: 0 },
      menuSubtitle: ""
    }
  },
  allergens: {
    title: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 24,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 20, left: 0 }
    },
    description: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 20, left: 0 }
    },
    item: {
      number: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 16,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 10, bottom: 0, left: 0 }
      },
      title: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 16,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      description: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#666666",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      spacing: 12,
      backgroundColor: "#f5f5f5",
      borderRadius: 6,
      padding: 10,
      iconSize: 18
    }
  },
  categoryNotes: {
    icon: {
      iconSize: 18
    },
    title: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 4, left: 0 }
    },
    text: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    }
  },
  productFeatures: {
    icon: {
      iconSize: 18,
      iconSpacing: 6,
      marginTop: 2,
      marginBottom: 2
    },
    title: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#000000",
      fontStyle: "normal",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    }
  },
  servicePrice: {
    visible: true,
    fontFamily: "Arial",
    fontSize: 12,
    fontColor: "#000000",
    fontStyle: "normal",
    alignment: "center",
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  },
  pageBreaks: {
    categoryIds: []
  },
  spacing: {
    betweenCategories: 20,
    betweenProducts: 12,
    categoryTitleBottomMargin: 15
  },
  page: {
    marginTop: 25,
    marginRight: 25,
    marginBottom: 25,
    marginLeft: 25,
    useDistinctMarginsForPages: false,
    oddPages: {
      marginTop: 25,
      marginRight: 25,
      marginBottom: 25,
      marginLeft: 25
    },
    evenPages: {
      marginTop: 25,
      marginRight: 25,
      marginBottom: 25,
      marginLeft: 25
    },
    coverMarginTop: 30,
    coverMarginRight: 30,
    coverMarginBottom: 30,
    coverMarginLeft: 30,
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
  }
};
