
import { PrintLayout } from '@/types/printLayout';
import { Product, Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { calculateCategoryTitleHeight, calculateCategoryNoteHeight } from './calculators/categoryCalculator';
import { calculateProductHeight } from './calculators/productCalculator';
import { calculateServiceLineHeight } from './calculators/serviceCalculator';
import { calculateHeights } from './calculators/heightBatchCalculator';

interface HeightCalculation {
  categoryTitle: number;
  categoryNote: number;
  product: number;
  serviceLine: number;
}

export const useHeightCalculator = (layout: PrintLayout | null) => {
  return {
    calculateCategoryTitleHeight: (category: Category) => calculateCategoryTitleHeight(category, layout),
    calculateCategoryNoteHeight: (note: CategoryNote) => calculateCategoryNoteHeight(note, layout),
    calculateProductHeight: (product: Product) => calculateProductHeight(product, layout),
    calculateServiceLineHeight: () => calculateServiceLineHeight(layout),
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
