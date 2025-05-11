
import { Allergen, Product, ProductFeature } from "@/types/database";

export const useProductOrganizer = () => {
  // Utility for grouping by product_id
  const groupByProductId = (items: any[]) => {
    const result: Record<string, any[]> = {};
    for (const item of items) {
      if (!result[item.product_id]) {
        result[item.product_id] = [];
      }
      result[item.product_id].push(item);
    }
    return result;
  };

  // Organize products by category and add details for allergens and features
  const organizeProductsByCategory = (
    products: any[],
    allergensByProductId: Record<string, any[]>,
    featuresByProductId: Record<string, any[]>,
    allAllergensData: any[],
    allFeaturesData: any[]
  ) => {
    const result: Record<string, Product[]> = {};
    
    // Create maps for faster access
    const allergensMap = allAllergensData.reduce((acc, allergen) => {
      acc[allergen.id] = allergen;
      return acc;
    }, {} as Record<string, any>);
    
    const featuresMap = allFeaturesData.reduce((acc, feature) => {
      acc[feature.id] = feature;
      return acc;
    }, {} as Record<string, any>);
    
    // Organize products by category
    for (const product of products) {
      if (!result[product.category_id]) {
        result[product.category_id] = [];
      }
      
      // Add allergens to product
      const productAllergens = allergensByProductId[product.id] || [];
      const allergenDetails = productAllergens
        .map(item => allergensMap[item.allergen_id])
        .filter(Boolean)
        .sort((a, b) => a.number - b.number);
      
      // Add features to product
      const productFeatures = featuresByProductId[product.id] || [];
      const featureDetails = productFeatures
        .map(item => featuresMap[item.feature_id])
        .filter(Boolean)
        .sort((a, b) => a.display_order - b.display_order);
      
      result[product.category_id].push({
        ...product,
        allergens: allergenDetails,
        features: featureDetails
      });
    }
    
    return result;
  };

  return {
    groupByProductId,
    organizeProductsByCategory
  };
};
