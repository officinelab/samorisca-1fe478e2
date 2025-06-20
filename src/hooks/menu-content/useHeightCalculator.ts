
import { PrintLayout } from '@/types/printLayout';
import { Product, Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { calculateCategoryTitleHeight, calculateCategoryNoteHeight } from './calculators/categoryCalculator';
import { calculateProductHeight } from './calculators/productCalculator';
import { calculateServiceLineHeight } from './calculators/serviceCalculator';

export const useHeightCalculator = (layout: PrintLayout | null) => {
  const calculateCategoryHeight = (category: Category, notes: CategoryNote[], currentLayout: PrintLayout) => {
    const titleHeight = calculateCategoryTitleHeight(category, currentLayout);
    const notesHeight = notes.reduce((total, note) => {
      return total + calculateCategoryNoteHeight(note, currentLayout);
    }, 0);
    return titleHeight + notesHeight;
  };

  return {
    calculateCategoryTitleHeight: (category: Category, currentLayout: PrintLayout) => calculateCategoryTitleHeight(category, currentLayout),
    calculateCategoryNoteHeight: (note: CategoryNote, currentLayout: PrintLayout) => calculateCategoryNoteHeight(note, currentLayout),
    calculateProductHeight: (product: Product, currentLayout: PrintLayout) => calculateProductHeight(product, currentLayout),
    calculateServiceLineHeight: (currentLayout: PrintLayout) => calculateServiceLineHeight(currentLayout),
    calculateCategoryHeight,
    isLoading: false
  };
};
