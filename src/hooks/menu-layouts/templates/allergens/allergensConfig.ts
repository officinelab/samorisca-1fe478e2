
import { PrintLayout } from "@/types/printLayout";

export const createAllergensConfig = (): PrintLayout['allergens'] => ({
  title: {
    fontFamily: "Belleza",
    fontSize: 20,
    fontColor: "#2c3e50",
    fontStyle: "bold",
    alignment: "center",
    margin: { top: 0, right: 0, bottom: 15, left: 0 },
    visible: true
  },
  description: {
    fontFamily: "Arial",
    fontSize: 12,
    fontColor: "#555555",
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
      fontColor: "#2c3e50",
      fontStyle: "bold",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 3, left: 0 },
      visible: true
    },
    description: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#555555",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      visible: true
    },
    spacing: 0,
    backgroundColor: "#e74c3c",
    borderRadius: 50,
    padding: 8,
    iconSize: 24
  }
});

export const createCategoryNotesConfig = (): PrintLayout['categoryNotes'] => ({
  icon: { iconSize: 16 },
  title: {
    visible: true,
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#2c3e50",
    fontStyle: "bold",
    alignment: "left",
    margin: { top: 0, right: 0, bottom: 2, left: 0 }
  },
  text: {
    visible: true,
    fontFamily: "Arial",
    fontSize: 12,
    fontColor: "#555555",
    fontStyle: "normal",
    alignment: "left",
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  }
});

export const createProductFeaturesConfig = (): PrintLayout['productFeatures'] => ({
  sectionTitle: {
    visible: true,
    fontFamily: "Belleza",
    fontSize: 18,
    fontColor: "#2c3e50",
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
    fontColor: "#2c3e50",
    fontStyle: "normal",
    alignment: "left",
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  }
});
