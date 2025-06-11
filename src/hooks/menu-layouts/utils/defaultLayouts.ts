import { PrintLayout } from "@/types/printLayout";

export const defaultLayouts: PrintLayout[] = [
  {
    id: "classic-layout",
    name: "Layout Classico",
    type: "classic",
    isDefault: true,
    productSchema: "schema1",
    elements: {
      category: {
        fontFamily: "Arial",
        fontSize: 16,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 5, left: 0 },
        visible: true
      },
      title: {
        fontFamily: "Arial",
        fontSize: 20,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 5, right: 0, bottom: 2, left: 0 },
        visible: true
      },
      description: {
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#444444",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 2, right: 0, bottom: 5, left: 0 },
        visible: true
      },
      descriptionEng: {
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#444444",
        fontStyle: "italic",
        alignment: "left",
        margin: { top: 2, right: 0, bottom: 5, left: 0 },
        visible: true
      },
      allergensList: {
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#666666",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 5, left: 0 },
        visible: true
      },
      productFeatures: {
        iconSize: 16,
        iconSpacing: 8,
        marginTop: 4,
        marginBottom: 4
      },
      price: {
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#228B22",
        fontStyle: "normal",
        alignment: "right",
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        visible: true
      },
      suffix: {
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#228B22",
        fontStyle: "normal",
        alignment: "left",
        visible: true
      },
      priceVariants: {
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#888888",
        fontStyle: "italic",
        alignment: "right",
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        visible: true
      }
    },
    cover: {
      logo: {
        imageUrl: "/images/logo.png",
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
        menuTitle: "Nome del Menu",
        visible: true
      },
      subtitle: {
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "center",
        margin: { top: 5, right: 0, bottom: 0, left: 0 },
        menuSubtitle: "Sottotitolo del Menu",
        visible: true
      }
    },
    allergens: {
      title: {
        fontFamily: "Arial",
        fontSize: 18,
        fontColor: "#FF0000",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 10, right: 0, bottom: 5, left: 0 },
        visible: true
      },
      description: {
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 10, left: 0 },
        visible: true
      },
      item: {
        number: {
          fontFamily: "Arial",
          fontSize: 12,
          fontColor: "#FFFFFF",
          fontStyle: "bold",
          alignment: "center",
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          visible: true
        },
        title: {
          fontFamily: "Arial",
          fontSize: 14,
          fontColor: "#000000",
          fontStyle: "bold",
          alignment: "left",
          margin: { top: 0, right: 0, bottom: 0, left: 5 },
          visible: true
        },
        description: {
          fontFamily: "Arial",
          fontSize: 12,
          fontColor: "#444444",
          fontStyle: "normal",
          alignment: "left",
          margin: { top: 0, right: 0, bottom: 5, left: 0 },
          visible: true
        },
        spacing: 2,
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
        margin: { top: 0, right: 0, bottom: 2, left: 0 },
        visible: true
      },
      text: {
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        visible: true
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
      betweenCategories: 20,
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
  }
];
