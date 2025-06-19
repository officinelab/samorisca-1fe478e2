import { PrintLayout } from '@/types/printLayout';
import { calculateTextHeight, MM_TO_PX } from '../utils/textMeasurement';

export const calculateServiceLineHeight = (layout: PrintLayout | null): number => {
  if (!layout) return 15; // Default height in mm

  const serviceConfig = layout.servicePrice;
  const pageConfig = layout.page;
  
  // Calcola la larghezza disponibile
  const pageWidthMm = 210;
  const leftMargin = pageConfig.marginLeft || 25;
  const rightMargin = pageConfig.marginRight || 25;
  const availableWidthMm = pageWidthMm - leftMargin - rightMargin;
  const availableWidthPx = availableWidthMm * MM_TO_PX;
  
  // Il testo del servizio include anche il prezzo, quindi stimiamo una lunghezza tipica
  const serviceText = "Servizio e Coperto = €3.00";
  
  const fontSizePx = serviceConfig.fontSize * 1.333;
  const textHeightPx = calculateTextHeight(
    serviceText,
    fontSizePx,
    serviceConfig.fontFamily,
    availableWidthPx,
    1.5
  );
  
  const textHeightMm = textHeightPx / MM_TO_PX;
  const marginMm = serviceConfig.margin.top + serviceConfig.margin.bottom;
  
  // Aggiungi altezza per il bordo superiore e padding
  const borderAndPaddingMm = 5; // 1px border + padding convertito in mm
  
  return textHeightMm + marginMm + borderAndPaddingMm;
};