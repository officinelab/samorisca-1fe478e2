
import { Category, Product } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { PrintLayout } from '@/types/printLayout';
import { calculateCategoryTitleHeight, calculateCategoryNoteHeight } from './categoryCalculator';
import { calculateProductHeight } from './productCalculator';
import { calculateServiceLineHeight } from './serviceCalculator';

interface HeightCalculation {
  categoryTitle: number;
  categoryNote: number;
  product: number;
  serviceLine: number;
}

export const calculateHeights = (
  categories: Category[],
  productsByCategory: Record<string, Product[]>,
  categoryNotes: CategoryNote[],
  categoryNotesRelations: Record<string, string[]>,
  layout: PrintLayout | null
): HeightCalculation[] => {
  const calculations: HeightCalculation[] = [];

  categories.forEach(category => {
    const categoryHeight = calculateCategoryTitleHeight(category, layout);
    
    // Calculate category notes height
    const relatedNoteIds = categoryNotesRelations[category.id] || [];
    const relatedNotes = categoryNotes.filter(note => relatedNoteIds.includes(note.id));
    const notesHeight = relatedNotes.reduce((sum, note) => sum + calculateCategoryNoteHeight(note, layout), 0);

    const products = productsByCategory[category.id] || [];
    products.forEach(product => {
      const productHeight = calculateProductHeight(product, layout);
      
      calculations.push({
        categoryTitle: categoryHeight,
        categoryNote: notesHeight,
        product: productHeight,
        serviceLine: calculateServiceLineHeight(layout)
      });
    });
  });

  return calculations;
};
