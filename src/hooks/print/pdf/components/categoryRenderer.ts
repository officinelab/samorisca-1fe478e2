
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { addStyledText } from './textRenderer';

// Add category title to PDF
export const addCategoryToPdf = (
  pdf: jsPDF,
  category: Category,
  x: number,
  y: number,
  layout: PrintLayout,
  maxWidth: number
): number => {
  const categoryConfig = layout.elements.category;
  
  const textHeight = addStyledText(pdf, category.title, x, y, {
    fontSize: categoryConfig.fontSize,
    fontFamily: categoryConfig.fontFamily,
    fontStyle: categoryConfig.fontStyle,
    fontColor: categoryConfig.fontColor,
    alignment: categoryConfig.alignment,
    maxWidth
  });
  
  return textHeight + layout.spacing.categoryTitleBottomMargin;
};

// Add category notes to PDF
export const addCategoryNotesToPdf = (
  pdf: jsPDF,
  notes: CategoryNote[],
  x: number,
  y: number,
  layout: PrintLayout,
  maxWidth: number
): number => {
  if (notes.length === 0) return 0;
  
  let currentY = y;
  const notesConfig = layout.categoryNotes;
  
  notes.forEach((note, index) => {
    // Add note title
    const titleHeight = addStyledText(pdf, note.title, x, currentY, {
      fontSize: notesConfig.title.fontSize,
      fontFamily: notesConfig.title.fontFamily,
      fontStyle: notesConfig.title.fontStyle,
      fontColor: notesConfig.title.fontColor,
      alignment: notesConfig.title.alignment,
      maxWidth
    });
    
    currentY += titleHeight + notesConfig.title.margin.bottom;
    
    // Add note text
    const textHeight = addStyledText(pdf, note.text, x, currentY, {
      fontSize: notesConfig.text.fontSize,
      fontFamily: notesConfig.text.fontFamily,
      fontStyle: notesConfig.text.fontStyle,
      fontColor: notesConfig.text.fontColor,
      alignment: notesConfig.text.alignment,
      maxWidth
    });
    
    currentY += textHeight + (index < notes.length - 1 ? 5 : 0); // 5mm spacing between notes
  });
  
  return currentY - y;
};
