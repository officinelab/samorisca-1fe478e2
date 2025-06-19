
import { Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { PrintLayout } from '@/types/printLayout';
import { calculateTextHeight, MM_TO_PX } from '../utils/textMeasurement';

export const calculateCategoryTitleHeight = (category: Category, layout: PrintLayout | null): number => {
  if (!layout) return 60; // Default height in pixels

  const categoryConfig = layout.elements.category;
  const availableWidth = 180; // A4 width minus margins in mm, converted to approximate text width
  
  const textHeight = calculateTextHeight(
    category.title,
    categoryConfig.fontSize,
    categoryConfig.fontFamily,
    availableWidth * MM_TO_PX
  );

  const totalMargin = categoryConfig.margin.top + categoryConfig.margin.bottom;
  const bottomSpacing = layout.spacing.categoryTitleBottomMargin;
  
  return (textHeight / MM_TO_PX) + totalMargin + bottomSpacing;
};

export const calculateCategoryNoteHeight = (note: CategoryNote, layout: PrintLayout | null): number => {
  if (!layout) return 40; // Default height in mm

  const noteConfig = layout.categoryNotes;
  const availableWidth = 180; // A4 width minus margins in mm
  
  const titleHeight = calculateTextHeight(
    note.title,
    noteConfig.title.fontSize,
    noteConfig.title.fontFamily,
    availableWidth * MM_TO_PX
  );

  const textHeight = calculateTextHeight(
    note.text,
    noteConfig.text.fontSize,
    noteConfig.text.fontFamily,
    availableWidth * MM_TO_PX
  );

  const titleMargin = noteConfig.title.margin.top + noteConfig.title.margin.bottom;
  const textMargin = noteConfig.text.margin.top + noteConfig.text.margin.bottom;
  const iconHeight = noteConfig.icon.iconSize / MM_TO_PX;

  return ((titleHeight + textHeight) / MM_TO_PX) + titleMargin + textMargin + iconHeight + 5; // 5mm padding
};
