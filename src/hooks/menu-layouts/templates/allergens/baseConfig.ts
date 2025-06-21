
import { PrintLayout } from "@/types/printLayout";

export const createBaseAllergensConfig = (id: string): Partial<PrintLayout> => ({
  id,
  name: "Layout Allergeni",
  type: "allergens",
  isDefault: false,
  productSchema: "schema1"
});

export const createElementsConfig = (): PrintLayout['elements'] => ({
  category: {
    fontFamily: "Belleza",
    fontSize: 18,
    fontColor: "#2c3e50",
    fontStyle: "bold",
    alignment: "left",
    margin: { top: 0, right: 0, bottom: 15, left: 0 },
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
});
