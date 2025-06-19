
import { Product, Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { PrintLayout } from '@/types/printLayout';

interface MeasurementData {
  categoryTitles: Map<string, number>;
  categoryNotes: Map<string, number>;
  products: Map<string, number>;
  serviceLineHeight: number;
}

export const calculateCategoryTitleHeightReal = (
  category: Category, 
  measurements: MeasurementData | null
): number => {
  if (!measurements) return 60; // Fallback
  return measurements.categoryTitles.get(category.id) || 60;
};

export const calculateCategoryNoteHeightReal = (
  note: CategoryNote, 
  measurements: MeasurementData | null
): number => {
  if (!measurements) return 40; // Fallback
  return measurements.categoryNotes.get(note.id) || 40;
};

export const calculateProductHeightReal = (
  product: Product, 
  measurements: MeasurementData | null
): number => {
  if (!measurements) return 80; // Fallback
  return measurements.products.get(product.id) || 80;
};

export const calculateServiceLineHeightReal = (
  measurements: MeasurementData | null
): number => {
  if (!measurements) return 15; // Fallback
  return measurements.serviceLineHeight;
};
