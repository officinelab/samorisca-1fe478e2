
import { PrintLayout } from "@/types/printLayout";

export function transformDbToLayout(dbLayout: any): PrintLayout {
  // Assicura che i nuovi campi margini esistano nel page object
  const pageWithDefaults = {
    ...dbLayout.page,
    coverMarginTop: dbLayout.page.coverMarginTop || 25,
    coverMarginRight: dbLayout.page.coverMarginRight || 25,
    coverMarginBottom: dbLayout.page.coverMarginBottom || 25,
    coverMarginLeft: dbLayout.page.coverMarginLeft || 25,
    allergensMarginTop: dbLayout.page.allergensMarginTop || 20,
    allergensMarginRight: dbLayout.page.allergensMarginRight || 15,
    allergensMarginBottom: dbLayout.page.allergensMarginBottom || 20,
    allergensMarginLeft: dbLayout.page.allergensMarginLeft || 15,
    useDistinctMarginsForAllergensPages: dbLayout.page.useDistinctMarginsForAllergensPages || false,
    allergensOddPages: dbLayout.page.allergensOddPages || {
      marginTop: 20,
      marginRight: 15,
      marginBottom: 20,
      marginLeft: 15
    },
    allergensEvenPages: dbLayout.page.allergensEvenPages || {
      marginTop: 20,
      marginRight: 15,
      marginBottom: 20,
      marginLeft: 15
    }
  };

  return {
    id: dbLayout.id,
    name: dbLayout.name,
    type: dbLayout.type,
    isDefault: dbLayout.is_default,
    productSchema: dbLayout.product_schema,
    elements: dbLayout.elements,
    cover: dbLayout.cover,
    allergens: dbLayout.allergens,
    categoryNotes: dbLayout.category_notes,
    productFeatures: dbLayout.product_features,
    servicePrice: dbLayout.service_price || {
      visible: true,
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#000000",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    spacing: dbLayout.spacing,
    page: pageWithDefaults
  };
}

export function transformLayoutToDb(layout: PrintLayout): any {
  return {
    id: layout.id,
    name: layout.name,
    type: layout.type,
    is_default: layout.isDefault,
    product_schema: layout.productSchema,
    elements: layout.elements,
    cover: layout.cover,
    allergens: layout.allergens,
    category_notes: layout.categoryNotes,
    product_features: layout.productFeatures,
    service_price: layout.servicePrice,
    spacing: layout.spacing,
    page: layout.page
  };
}

export const mapSupabaseToLayout = (data: any): PrintLayout => {
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    isDefault: data.is_default,
    productSchema: data.product_schema,
    elements: data.elements,
    cover: data.cover,
    allergens: data.allergens,
    categoryNotes: data.category_notes,
    productFeatures: data.product_features,
    servicePrice: data.service_price || {
      visible: true,
      fontFamily: "Arial",
      fontSize: 12,
      fontColor: "#000000",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    spacing: data.spacing,
    page: {
      ...data.page,
      coverMarginTop: data.page.coverMarginTop || 25,
      coverMarginRight: data.page.coverMarginRight || 25,
      coverMarginBottom: data.page.coverMarginBottom || 25,
      coverMarginLeft: data.page.coverMarginLeft || 25,
      allergensMarginTop: data.page.allergensMarginTop || 20,
      allergensMarginRight: data.page.allergensMarginRight || 15,
      allergensMarginBottom: data.page.allergensMarginBottom || 20,
      allergensMarginLeft: data.page.allergensMarginLeft || 15,
      useDistinctMarginsForAllergensPages: data.page.useDistinctMarginsForAllergensPages || false,
      allergensOddPages: data.page.allergensOddPages || {
        marginTop: 20,
        marginRight: 15,
        marginBottom: 20,
        marginLeft: 15
      },
      allergensEvenPages: data.page.allergensEvenPages || {
        marginTop: 20,
        marginRight: 15,
        marginBottom: 20,
        marginLeft: 15
      }
    }
  };
};
