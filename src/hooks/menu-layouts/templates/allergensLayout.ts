
import { PrintLayout } from "@/types/printLayout";
import { v4 as uuidv4 } from 'uuid';
import { createBaseAllergensConfig, createElementsConfig } from './allergens/baseConfig';
import { createAllergensConfig, createCategoryNotesConfig, createProductFeaturesConfig } from './allergens/allergensConfig';
import { createCoverConfig, createServicePriceConfig, createPageBreaksConfig, createSpacingConfig } from './allergens/coverConfig';
import { createPageConfig } from './allergens/pageConfig';
import { createLegacyAllergensLayout } from './allergens/legacyConfig';

// Export legacy layout for backward compatibility
export const allergensLayout: PrintLayout = createLegacyAllergensLayout();

export const getAllergensLayout = (): PrintLayout => {
  const baseConfig = createBaseAllergensConfig(uuidv4());
  
  return {
    ...baseConfig,
    elements: createElementsConfig(),
    cover: createCoverConfig(),
    allergens: createAllergensConfig(),
    categoryNotes: createCategoryNotesConfig(),
    productFeatures: createProductFeaturesConfig(),
    servicePrice: createServicePriceConfig(),
    pageBreaks: createPageBreaksConfig(),
    spacing: createSpacingConfig(),
    page: createPageConfig()
  } as PrintLayout;
};
