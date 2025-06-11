import { PrintLayout } from "@/types/printLayout";
import { v4 as uuidv4 } from "uuid";

const defaultProductFeatures = {
  iconSize: 16,
  iconSpacing: 8,
  marginTop: 4,
  marginBottom: 4
};

const baseCategoryNotes = {
  icon: {
    iconSize: 16
  },
  title: {
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#000000",
    fontStyle: "bold" as const,
    alignment: "left" as const,
    margin: { top: 0, right: 0, bottom: 2, left: 0 },
    visible: true
  },
  text: {
    fontFamily: "Arial",
    fontSize: 12,
    fontColor: "#333333",
    fontStyle: "normal" as const,
    alignment: "left" as const,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    visible: true
  }
};

const baseElements = {
  category: {
    fontFamily: "Arial",
    fontSize: 12,
    fontColor: "#333333",
    fontStyle: "bold" as const,
    alignment: "left" as const,
    margin: { top: 0, right: 0, bottom: 8, left: 0 },
    visible: true
  },
  title: {
    fontFamily: "Arial",
    fontSize: 11,
    fontColor: "#000000",
    fontStyle: "bold" as const,
    alignment: "left" as const,
    margin: { top: 0, right: 0, bottom: 2, left: 0 },
    visible: true
  },
  description: {
    fontFamily: "Arial",
    fontSize: 9,
    fontColor: "#666666",
    fontStyle: "italic" as const,
    alignment: "left" as const,
    margin: { top: 2, right: 0, bottom: 2, left: 0 },
    visible: true
  },
  descriptionEng: {
    fontFamily: "Arial",
    fontSize: 8,
    fontColor: "#888888",
    fontStyle: "italic" as const,
    alignment: "left" as const,
    margin: { top: 1, right: 0, bottom: 2, left: 0 },
    visible: true
  },
  allergensList: {
    fontFamily: "Arial",
    fontSize: 8,
    fontColor: "#999999",
    fontStyle: "normal" as const,
    alignment: "left" as const,
    margin: { top: 2, right: 0, bottom: 0, left: 0 },
    visible: true
  },
  productFeatures: defaultProductFeatures,
  price: {
    fontFamily: "Arial",
    fontSize: 11,
    fontColor: "#000000",
    fontStyle: "bold" as const,
    alignment: "right" as const,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    visible: true
  },
  suffix: {
    fontFamily: "Arial",
    fontSize: 8,
    fontColor: "#666666",
    fontStyle: "normal" as const,
    alignment: "right" as const
  },
  priceVariants: {
    fontFamily: "Arial",
    fontSize: 9,
    fontColor: "#666666",
    fontStyle: "normal" as const,
    alignment: "right" as const,
    margin: { top: 2, right: 0, bottom: 0, left: 0 },
    visible: true
  }
};

const baseCover = {
  logo: {
    imageUrl: "",
    maxWidth: 80,
    maxHeight: 50,
    alignment: "center" as const,
    marginTop: 20,
    marginBottom: 20,
    visible: true
  },
  title: {
    visible: true,
    fontFamily: "Arial",
    fontSize: 24,
    fontColor: "#000000",
    fontStyle: "bold" as const,
    alignment: "center" as const,
    margin: { top: 20, right: 0, bottom: 10, left: 0 },
    menuTitle: ""
  },
  subtitle: {
    visible: true,
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#666666",
    fontStyle: "italic" as const,
    alignment: "center" as const,
    margin: { top: 5, right: 0, bottom: 0, left: 0 },
    menuSubtitle: ""
  }
};

const baseAllergens = {
  title: {
    fontFamily: "Arial",
    fontSize: 16,
    fontColor: "#000000",
    fontStyle: "bold" as const,
    alignment: "center" as const,
    margin: { top: 0, right: 0, bottom: 20, left: 0 },
    visible: true
  },
  description: {
    fontFamily: "Arial",
    fontSize: 11,
    fontColor: "#666666",
    fontStyle: "normal" as const,
    alignment: "center" as const,
    margin: { top: 0, right: 0, bottom: 30, left: 0 },
    visible: true
  },
  item: {
    number: {
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#000000",
      fontStyle: "bold" as const,
      alignment: "left" as const,
      margin: { top: 0, right: 8, bottom: 0, left: 0 },
      visible: true
    },
    title: {
      fontFamily: "Arial",
      fontSize: 11,
      fontColor: "#000000",
      fontStyle: "bold" as const,
      alignment: "left" as const,
      margin: { top: 0, right: 0, bottom: 2, left: 0 },
      visible: true
    },
    description: {
      fontFamily: "Arial",
      fontSize: 9,
      fontColor: "#666666",
      fontStyle: "normal" as const,
      alignment: "left" as const,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      visible: true
    },
    spacing: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 4,
    padding: 12,
    iconSize: 16
  }
};

const baseSpacing = {
  betweenCategories: 20,
  betweenProducts: 8,
  categoryTitleBottomMargin: 12
};

const basePage = {
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
};

export const defaultLayouts: PrintLayout[] = [
  {
    id: uuidv4(),
    name: "Layout Predefinito",
    type: "classic",
    isDefault: true,
    productSchema: "schema1",
    elements: baseElements,
    cover: baseCover,
    allergens: baseAllergens,
    categoryNotes: baseCategoryNotes,
    spacing: baseSpacing,
    page: basePage
  }
];
