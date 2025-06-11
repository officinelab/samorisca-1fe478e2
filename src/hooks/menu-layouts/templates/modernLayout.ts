import { PrintLayout } from "@/types/printLayout";

export const modernLayout: PrintLayout = {
  id: 'modern-layout',
  name: 'Layout Moderno',
  type: 'custom',
  isDefault: false,
  productSchema: 'schema2',
  elements: {
    category: {
      fontFamily: "Arial",
      fontSize: 16,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 5, right: 0, bottom: 5, left: 0 },
      visible: true
    },
    title: {
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 2, right: 0, bottom: 2, left: 0 },
      visible: true
    },
    description: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#666666",
      fontStyle: "italic",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 5, left: 0 },
      visible: true
    },
    descriptionEng: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#666666",
      fontStyle: "italic",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 5, left: 0 },
      visible: true
    },
    allergensList: {
      fontFamily: "Arial",
      fontSize: 10,
      fontColor: "#990000",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      visible: true
    },
    productFeatures: {
      iconSize: 12,
      iconSpacing: 4,
      marginTop: 2,
      marginBottom: 2
    },
    price: {
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#008000",
      fontStyle: "bold",
      alignment: "right",
      margin: { top: 0, right: 0, bottom: 0, left: 5 },
      visible: true
    },
    suffix: {
      fontFamily: "Arial",
      fontSize: 10,
      fontColor: "#008000",
      fontStyle: "normal",
      alignment: "left",
      visible: true
    },
    priceVariants: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#008000",
      fontStyle: "italic",
      alignment: "right",
      margin: { top: 0, right: 0, bottom: 0, left: 5 },
      visible: true
    }
  },
  cover: {
    logo: {
      imageUrl: null,
      maxWidth: 70,
      maxHeight: 40,
      alignment: "center",
      marginTop: 15,
      marginBottom: 10,
      visible: true
    },
    title: {
      fontFamily: "Helvetica",
      fontSize: 28,
      fontColor: "#1A202C",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 10, right: 0, bottom: 5, left: 0 },
      menuTitle: "Titolo del Menu",
      visible: true
    },
    subtitle: {
      fontFamily: "Helvetica",
      fontSize: 16,
      fontColor: "#4A5568",
      fontStyle: "italic",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 15, left: 0 },
      menuSubtitle: "Sottotitolo Opzionale",
      visible: true
    }
  },
  allergens: {
    title: {
      fontFamily: "Arial",
      fontSize: 18,
      fontColor: "#B00020",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 10, right: 0, bottom: 5, left: 0 },
      visible: true
    },
    description: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#444444",
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
        fontSize: 12,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 5, left: 0 },
        visible: true
      },
      description: {
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#555555",
        fontStyle: "italic",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 5, left: 0 },
        visible: true
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
