
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
  
  // Calcola lo spazio occupato dall'icona se presente
  let iconWidthMm = 0;
  if (note.icon_url) {
    iconWidthMm = (noteConfig.icon.iconSize / MM_TO_PX) + 3; // 3mm spacing per icona + gap
  }
  
  const textAvailableWidthPx = (availableWidthMm - iconWidthMm) * MM_TO_PX;
  
  // Calcola altezza del titolo usando la configurazione corretta
  const titleFontSizePx = noteConfig.title.fontSize * 1.333; // pt to px
  const titleHeightPx = calculateTextHeight(
    note.title,
    titleFontSizePx,
    noteConfig.title.fontFamily,
    textAvailableWidthPx,
    1.4
  );

  // Calcola altezza del testo usando la configurazione corretta
  const textFontSizePx = noteConfig.text.fontSize * 1.333; // pt to px
  const textHeightPx = calculateTextHeight(
    note.text,
    textFontSizePx,
    noteConfig.text.fontFamily,
    textAvailableWidthPx,
    1.5
  );

  // Converti in mm
  const titleHeightMm = titleHeightPx / MM_TO_PX;
  const textHeightMm = textHeightPx / MM_TO_PX;
  
  // Somma tutte le altezze usando i margini corretti dalla configurazione
  const titleMarginMm = noteConfig.title.margin.top + noteConfig.title.margin.bottom;
  const textMarginMm = noteConfig.text.margin.top + noteConfig.text.margin.bottom;
  
  // Calcola l'altezza dell'icona se presente
  const iconHeightMm = note.icon_url ? (noteConfig.icon.iconSize / MM_TO_PX) : 0;
  
  // L'altezza totale è il massimo tra l'altezza dell'icona e l'altezza del testo
  const contentHeightMm = Math.max(
    iconHeightMm,
    titleHeightMm + textHeightMm + titleMarginMm + textMarginMm
  );
  
  return contentHeightMm + 5; // 5mm padding extra
};
