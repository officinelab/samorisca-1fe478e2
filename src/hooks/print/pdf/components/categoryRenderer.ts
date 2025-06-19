import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { addStyledText } from './textRenderer';

// Add category title to PDF with correct dimensions
export const addCategoryToPdf = (
  pdf: jsPDF,
  category: Category,
  x: number,
  y: number,
  layout: PrintLayout,
  maxWidth: number
): number => {
  console.log('🏷️ PDF Category rendering:', category.title);
  
  const textHeight = addStyledText(pdf, category.title, x, y, {
    fontSize: layout.elements.category.fontSize, // USA PT DIRETTO
    fontFamily: layout.elements.category.fontFamily,
    fontStyle: layout.elements.category.fontStyle,
    fontColor: layout.elements.category.fontColor,
    alignment: layout.elements.category.alignment,
    maxWidth
  });
  
  // ✅ USA SPACING DIRETTO DAL LAYOUT
  return textHeight + layout.spacing.categoryTitleBottomMargin;
};

// Add category notes to PDF with correct dimensions
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
  
  console.log('📝 PDF Category notes rendering:', notes.length, 'notes');
  
  notes.forEach((note, index) => {
    // Add note title (leggermente più piccolo del titolo categoria)
    const titleHeight = addStyledText(pdf, note.title, x, currentY, {
      fontSize: layout.elements.category.fontSize * 0.9, // USA PT DIRETTO con riduzione
      fontFamily: layout.categoryNotes.title.fontFamily,
      fontStyle: layout.categoryNotes.title.fontStyle,
      fontColor: layout.categoryNotes.title.fontColor,
      alignment: layout.categoryNotes.title.alignment,
      maxWidth
    });
    
    currentY += titleHeight + layout.categoryNotes.title.margin.bottom;
    
    // Add note text (simile alla descrizione prodotto)
    const textHeight = addStyledText(pdf, note.text, x, currentY, {
      fontSize: layout.elements.description.fontSize * 0.95, // USA PT DIRETTO con riduzione
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