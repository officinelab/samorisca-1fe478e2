
import { PrintLayout } from "@/types/printLayout";

export const createCoverConfig = (): PrintLayout['cover'] => ({
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
    fontFamily: "Belleza",
    fontSize: 24,
    fontColor: "#2c3e50",
    fontStyle: "bold",
    alignment: "center",
    margin: { top: 20, right: 0, bottom: 10, left: 0 },
    menuTitle: ""
  },
  subtitle: {
    visible: true,
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#7f8c8d",
    fontStyle: "italic",
    alignment: "center",
    margin: { top: 5, right: 0, bottom: 0, left: 0 },
    menuSubtitle: ""
  }
});

export const createServicePriceConfig = (): PrintLayout['servicePrice'] => ({
  visible: true,
  fontFamily: "Arial",
  fontSize: 12,
  fontColor: "#666666",
  fontStyle: "italic",
  alignment: "center",
  margin: { top: 10, right: 0, bottom: 0, left: 0 }
});

export const createPageBreaksConfig = (): PrintLayout['pageBreaks'] => ({
  categoryIds: []
});

export const createSpacingConfig = (): PrintLayout['spacing'] => ({
  betweenCategories: 25,
  betweenProducts: 12,
  categoryTitleBottomMargin: 15
});
