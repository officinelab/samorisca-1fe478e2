import { Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { PrintLayout } from '@/types/printLayout';
import { calculateTextHeight, MM_TO_PX } from '../utils/textMeasurement';

export const calculateCategoryTitleHeight = (category: Category, layout: PrintLayout | null): number => {
  if (!layout) return 60; // Default height in mm

  const categoryConfig = layout.elements.category;
  const pageConfig = layout.page;
  
  // Calcola la larghezza disponibile considerando i margini della pagina
  const pageWidthMm = 210; // A4 width
  const leftMargin = pageConfig.marginLeft || 25;
  const rightMargin = pageConfig.marginRight || 25;
  const availableWidthMm = pageWidthMm - leftMargin - rightMargin;
  const availableWidthPx = availableWidthMm * MM_TO_PX;
  
  // Converti font size da pt a px (1pt = 1.333px)
  const fontSizePx = categoryConfig.fontSize * 1.333;
  
  const textHeightPx = calculateTextHeight(
    category.title.toUpperCase(), // Le categorie sono in uppercase
    fontSizePx,
    categoryConfig.fontFamily,
    availableWidthPx,
    1.2 // line height
  );

  // Converti l'altezza del testo in mm
  const textHeightMm = textHeightPx / MM_TO_PX;
  
  // Aggiungi margini e spacing
  const totalMarginMm = categoryConfig.margin.top + categoryConfig.margin.bottom;
  const bottomSpacingMm = layout.spacing.categoryTitleBottomMargin;
  
  return textHeightMm + totalMarginMm + bottomSpacingMm;
};

export const calculateCategoryNoteHeight = (note: CategoryNote, layout: PrintLayout | null): number => {
  if (!layout) return 40; // Default height in mm

  const noteConfig = layout.categoryNotes;
  const pageConfig = layout.page;
  
  // Calcola la larghezza disponibile
  const pageWidthMm = 210;
  const leftMargin = pageConfig.marginLeft || 25;
  const rightMargin = pageConfig.marginRight || 25;
  const availableWidthMm = pageWidthMm - leftMargin - rightMargin;
  
  // Sottrai lo spazio per l'icona
  const iconWidthMm = (noteConfig.icon.iconSize / MM_TO_PX) + 2; // 2mm spacing
  const textAvailableWidthPx = (availableWidthMm - iconWidthMm) * MM_TO_PX;
  
  // Calcola altezza del titolo
  const titleFontSizePx = noteConfig.title.fontSize * 1.333;
  const titleHeightPx = calculateTextHeight(
    note.title,
    titleFontSizePx,
    noteConfig.title.fontFamily,
    textAvailableWidthPx,
    1.3
  );

  // Calcola altezza del testo
  const textFontSizePx = noteConfig.text.fontSize * 1.333;
  const textHeightPx = calculateTextHeight(
    note.text,
    textFontSizePx,
    noteConfig.text.fontFamily,
    textAvailableWidthPx,
    1.4
  );

  // Converti in mm
  const titleHeightMm = titleHeightPx / MM_TO_PX;
  const textHeightMm = textHeightPx / MM_TO_PX;
  
  // Somma tutte le altezze
  const titleMarginMm = noteConfig.title.margin.top + noteConfig.title.margin.bottom;
  const textMarginMm = noteConfig.text.margin.top + noteConfig.text.margin.bottom;
  const iconHeightMm = noteConfig.icon.iconSize / MM_TO_PX;
  
  // L'altezza totale è il massimo tra l'altezza dell'icona e l'altezza del testo
  const contentHeightMm = Math.max(
    iconHeightMm,
    titleHeightMm + textHeightMm + titleMarginMm + textMarginMm
  );
  
  return contentHeightMm + 5; // 5mm padding extra
};