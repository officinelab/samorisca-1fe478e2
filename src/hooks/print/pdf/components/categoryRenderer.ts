
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { addStyledText } from './textRenderer';
import { addSvgIconToPdf } from './iconRenderer';
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

// Category notes renderer IDENTICO all'anteprima con configurazione corretta
export const addCategoryNotesToPdf = async (
  pdf: jsPDF,
  notes: CategoryNote[],
  x: number,
  y: number,
  layout: PrintLayout,
  maxWidth: number
): Promise<number> => {
  if (notes.length === 0) return 0;
  
  let currentY = y;
  
  console.log('📝 PDF Category notes rendering - Con configurazione corretta:', notes.length, 'notes', {
    titleConfig: layout.categoryNotes.title,
    textConfig: layout.categoryNotes.text,
    iconConfig: layout.categoryNotes.icon
  });
  
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    let noteX = x;
    let textMaxWidth = maxWidth;
    
    // Aggiungi icona se presente
    if (note.icon_url) {
      const iconSizeMm = layout.categoryNotes.icon.iconSize / 3.78; // px to mm
      await addSvgIconToPdf(pdf, note.icon_url, noteX, currentY, iconSizeMm);
      noteX += iconSizeMm + 3; // 3mm gap dopo l'icona
      textMaxWidth -= (iconSizeMm + 3);
    }
    
    // Note title - Usa configurazione corretta
    const titleHeight = addStyledText(pdf, note.title, noteX, currentY, {
      fontSize: layout.categoryNotes.title.fontSize, // Usa configurazione diretta
      fontFamily: layout.categoryNotes.title.fontFamily,
      fontStyle: layout.categoryNotes.title.fontStyle,
      fontColor: layout.categoryNotes.title.fontColor,
      alignment: layout.categoryNotes.title.alignment,
      maxWidth: textMaxWidth
    });
    
    currentY += titleHeight + layout.categoryNotes.title.margin.bottom;
    
    // Note text - Usa configurazione corretta
    const textHeight = addStyledText(pdf, note.text, noteX, currentY, {
      fontSize: layout.categoryNotes.text.fontSize, // Usa configurazione diretta
      fontFamily: layout.categoryNotes.text.fontFamily,
      fontStyle: layout.categoryNotes.text.fontStyle,
      fontColor: layout.categoryNotes.text.fontColor,
      alignment: layout.categoryNotes.text.alignment,
      maxWidth: textMaxWidth
    });
    
    currentY += textHeight + (i < notes.length - 1 ? 3 : 0); // 3mm spacing between notes
  }
  
  return currentY - y + 5; // 5mm spacing after all notes
};
