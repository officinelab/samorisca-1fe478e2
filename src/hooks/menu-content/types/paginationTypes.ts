
import { Allergen, ProductFeature } from '@/types/database';

export interface AllergensPage {
  pageNumber: number;
  allergens: Allergen[];
  productFeatures: ProductFeature[];
  hasProductFeatures: boolean;
}

export interface AllergensPaginationResult {
  pages: AllergensPage[];
  totalPages: number;
}

export interface PaginationContext {
  availableHeight: number;
  headerHeight: number;
  totalProductFeaturesHeight: number;
  measurements: any;
}
