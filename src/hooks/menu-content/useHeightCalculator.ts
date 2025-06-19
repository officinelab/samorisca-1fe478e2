
import { PrintLayout } from '@/types/printLayout';
import { Product, Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { calculateCategoryTitleHeight, calculateCategoryNoteHeight } from './calculators/categoryCalculator';
import { calculateProductHeight } from './calculators/productCalculator';
import { calculateServiceLineHeight } from './calculators/serviceCalculator';
import { calculateHeights } from './calculators/heightBatchCalculator';
import { 
  calculateCategoryTitleHeightReal,
  calculateCategoryNoteHeightReal,
  calculateProductHeightReal,
  calculateServiceLineHeightReal
} from './calculators/realMeasurementCalculator';

interface HeightCalculation {
  categoryTitle: number;
  categoryNote: number;
  product: number;
  serviceLine: number;
}

interface MeasurementData {
  categoryTitles: Map<string, number>;
  categoryNotes: Map<string, number>;
  products: Map<string, number>;
  serviceLineHeight: number;
}

export const useHeightCalculator = (layout: PrintLayout | null, measurements?: MeasurementData | null) => {
  const useRealMeasurements = measurements !== undefined;

  return {
    calculateCategoryTitleHeight: (category: Category) => 
      useRealMeasurements 
        ? calculateCategoryTitleHeightReal(category, measurements)
        : calculateCategoryTitleHeight(category, layout),
    
    calculateCategoryNoteHeight: (note: CategoryNote) => 
      useRealMeasurements 
        ? calculateCategoryNoteHeightReal(note, measurements)
        : calculateCategoryNoteHeight(note, layout),
    
    calculateProductHeight: (product: Product) => 
      useRealMeasurements 
        ? calculateProductHeightReal(product, measurements)
        : calculateProductHeight(product, layout),
    
    calculateServiceLineHeight: () => 
      useRealMeasurements 
        ? calculateServiceLineHeightReal(measurements)
        : calculateServiceLineHeight(layout),
    
    calculateHeights: (
      categories: Category[],
      productsByCategory: Record<string, Product[]>,
      categoryNotes: CategoryNote[],
      categoryNotesRelations: Record<string, string[]>
    ): HeightCalculation[] => calculateHeights(
      categories,
      productsByCategory,
      categoryNotes,
      categoryNotesRelations,
      layout
    )
  };
};
