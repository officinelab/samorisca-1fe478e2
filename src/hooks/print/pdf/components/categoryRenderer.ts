import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { addStyledText } from './textRenderer';
import { getStandardizedDimensions } from '@/hooks/print/pdf/utils/conversionUtils';

// Add category title to PDF with dimensions matching preview exactly
export const addCategoryToPdf = (
  pdf: jsPDF,
  category: Category,
  x: number,
  y: number,
  layout: PrintLayout,
  maxWidth: number
): number => {
  const dimensions = getStandardizedDimensions(layout);
  
  console.log('🏷️ PDF Category rendering con dimensioni standardizzate:', category.title, {
    fontSize: dimensions.pdf.categoryFontSize,
    marginBottom: dimensions.spacing.categoryTitleBottomMargin
  });
  
  const textHeight = addStyledText(pdf, category.title, x, y, {
    fontSize: dimensions.pdf.categoryFontSize, // USA DIMENSIONI STANDARDIZZATE
    fontFamily: layout.elements.category.fontFamily,
    fontStyle: layout.elements.category.fontStyle,
    fontColor: layout.elements.category.fontColor,
    alignment: layout.elements.category.alignment,
    maxWidth
  });
  
  // ✅ USA SPACING STANDARDIZZATO IDENTICO ALL'ANTEPRIMA
  return textHeight + dimensions.spacing.categoryTitleBottomMargin;
};

// Add category notes to PDF with dimensions matching preview exactly
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
  
  console.log('📝 PDF Category notes rendering:', notes.length, 'notes');
  
  notes.forEach((note, index) => {
    // Add note title (leggermente più piccolo del titolo categoria)
    const titleHeight = addStyledText(pdf, note.title, x, currentY, {
      fontSize: dimensions.pdf.categoryFontSize * 0.9, // ✅ IDENTICO ALL'ANTEPRIMA
      fontFamily: layout.categoryNotes.title.fontFamily,
      fontStyle: layout.categoryNotes.title.fontStyle,
      fontColor: layout.categoryNotes.title.fontColor,
      alignment: layout.categoryNotes.title.alignment,
      maxWidth
    });
    
    currentY += titleHeight + layout.categoryNotes.title.margin.bottom;
    
    // Add note text (simile alla descrizione prodotto)
    const textHeight = addStyledText(pdf, note.text, x, currentY, {
      fontSize: dimensions.pdf.descriptionFontSize * 0.95, // ✅ IDENTICO ALL'ANTEPRIMA
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