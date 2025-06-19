
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { addStyledText } from './textRenderer';
import { getStandardizedDimensions } from '../utils/conversionUtils';

// Category renderer IDENTICO all'anteprima
export const addCategoryToPdf = (
  pdf: jsPDF,
  category: Category,
  x: number,
  y: number,
  layout: PrintLayout,
  maxWidth: number
): number => {
  const dimensions = getStandardizedDimensions(layout);
  
  console.log('🏷️ PDF Category rendering - IDENTICO anteprima:', category.title, {
    fontSize: dimensions.pdf.categoryFontSize,
    marginBottom: dimensions.spacing.categoryTitleBottomMargin
  });
  
  const textHeight = addStyledText(pdf, category.title, x, y, {
    fontSize: dimensions.pdf.categoryFontSize,      // IDENTICO CSS
    fontFamily: layout.elements.category.fontFamily,
    fontStyle: layout.elements.category.fontStyle,
    fontColor: layout.elements.category.fontColor,
    alignment: layout.elements.category.alignment,
    maxWidth
  });
  
  // ✅ Spacing IDENTICO anteprima
  return textHeight + dimensions.spacing.categoryTitleBottomMargin;
};

// Category notes renderer IDENTICO all'anteprima
export const addCategoryNotesToPdf = (
  pdf: jsPDF,
  notes: CategoryNote[],
  x: number,
  y: number,
  layout: PrintLayout,
  maxWidth: number
): number => {
  if (notes.length === 0) return 0;
  
  const dimensions = getStandardizedDimensions(layout);
  let currentY = y;
  
  console.log('📝 PDF Category notes rendering - IDENTICO anteprima:', notes.length, 'notes');
  
  notes.forEach((note, index) => {
    // Note title - Font size relativo al category title
    const titleFontSize = dimensions.pdf.categoryFontSize * 0.9; // 90% del titolo categoria
    const titleHeight = addStyledText(pdf, note.title, x, currentY, {
      fontSize: titleFontSize,
      fontFamily: layout.categoryNotes.title.fontFamily,
      fontStyle: layout.categoryNotes.title.fontStyle,
      fontColor: layout.categoryNotes.title.fontColor,
      alignment: layout.categoryNotes.title.alignment,
      maxWidth
    });
    
    currentY += titleHeight + layout.categoryNotes.title.margin.bottom;
    
    // Note text - Font size relativo alla descrizione
    const textFontSize = dimensions.pdf.descriptionFontSize * 0.95; // 95% della descrizione
    const textHeight = addStyledText(pdf, note.text, x, currentY, {
      fontSize: textFontSize,
      fontFamily: layout.categoryNotes.text.fontFamily,
      fontStyle: layout.categoryNotes.text.fontStyle,
      fontColor: layout.categoryNotes.text.fontColor,
      alignment: layout.categoryNotes.text.alignment,
      maxWidth
    });
    
    currentY += textHeight + (index < notes.length - 1 ? 3 : 0); // 3mm spacing between notes
  });
  
  return currentY - y + 5; // 5mm spacing after all notes
};
