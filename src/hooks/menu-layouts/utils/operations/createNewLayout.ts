import { v4 as uuidv4 } from 'uuid';
import { PrintLayout } from "@/types/printLayout";

export const createNewLayout = (name: string, baseLayout?: PrintLayout): PrintLayout => {
  
  const newLayout: PrintLayout = baseLayout ? {
    ...baseLayout,
    id: uuidv4(),
    name,
    isDefault: false
  } : {
    id: uuidv4(),
    name,
    type: "classic",
    isDefault: false,
    productSchema: "schema1",
    elements: {
      
      category: {
        fontFamily: "Arial",
        fontSize: 16,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 10, left: 0 },
        visible: true
      },
      title: {
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 5, left: 0 },
        visible: true
      },
      description: {
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 5, left: 0 },
        visible: true
      },
      descriptionEng: {
        fontFamily: "Arial",
        fontSize: 11,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 5, left: 0 },
        visible: true
      },
      allergensList: {
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#888888",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 5, left: 0 },
        visible: true
      },
      productFeatures: {
        iconSize: 14,
        iconSpacing: 4,
        marginTop: 3,
        marginBottom: 3
      },
      price: {
        fontFamily: "Arial",
        fontSize: 13,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "right",
        margin: { top: 0, right: 0, bottom: 0, left: 10 },
        visible: true
      },
      suffix: {
        fontFamily: "Arial",
        fontSize: 11,
        fontColor: "#666666",
        fontStyle: "normal",
        alignment: "right"
      },
      priceVariants: {
        fontFamily: "Arial",
        fontSize: 11,
        fontColor: "#444444",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 2, right: 0, bottom: 0, left: 0 },
        visible: true
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
        fontSize: 18,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 0, right: 0, bottom: 15, left: 0 },
        visible: true
      },
      description: {
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "center",
        margin: { top: 0, right: 0, bottom: 20, left: 0 },
        visible: true
      },
      item: {
        number: {
          fontFamily: "Arial",
          fontSize: 14,
          fontColor: "#ffffff",
          fontStyle: "bold",
          alignment: "center",
          margin: { top: 0, right: 8, bottom: 0, left: 0 },
          visible: true
        },
        title: {
          fontFamily: "Arial",
          fontSize: 14,
          fontColor: "#000000",
          fontStyle: "bold",
          alignment: "left",
          margin: { top: 0, right: 0, bottom: 3, left: 0 },
          visible: true
        },
        description: {
          fontFamily: "Arial",
          fontSize: 12,
          fontColor: "#333333",
          fontStyle: "normal",
          alignment: "left",
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          visible: true
        },
        spacing: 15,
        backgroundColor: "#e74c3c",
        borderRadius: 50,
        padding: 8,
        iconSize: 24
      }
    },
    categoryNotes: {
      
      icon: { iconSize: 16 },
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
      sectionTitle: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 18,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 5, right: 0, bottom: 10, left: 0 },
        text: "Caratteristiche Prodotto"
      },
      icon: {
        iconSize: 16,
        iconSpacing: 4,
        marginTop: 0,
        marginBottom: 0
      },
      itemTitle: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
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
    pageBreaks: {
      categoryIds: []
    },
    spacing: {
      
      betweenCategories: 20,
      betweenProducts: 10,
      categoryTitleBottomMargin: 10
    },
    page: {
      
      marginTop: 20,
      marginRight: 20,
      marginBottom: 20,
      marginLeft: 20,
      useDistinctMarginsForPages: false,
      oddPages: { marginTop: 20, marginRight: 20, marginBottom: 20, marginLeft: 20 },
      evenPages: { marginTop: 20, marginRight: 20, marginBottom: 20, marginLeft: 20 },
      coverMarginTop: 25,
      coverMarginRight: 25,
      coverMarginBottom: 25,
      coverMarginLeft: 25,
      allergensMarginTop: 20,
      allergensMarginRight: 15,
      allergensMarginBottom: 20,
      allergensMarginLeft: 15,
      useDistinctMarginsForAllergensPages: false,
      allergensOddPages: { marginTop: 20, marginRight: 15, marginBottom: 20, marginLeft: 15 },
      allergensEvenPages: { marginTop: 20, marginRight: 15, marginBottom: 20, marginLeft: 15 }
    }
  };

  return newLayout;
};
