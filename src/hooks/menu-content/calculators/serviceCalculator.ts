
import { PrintLayout } from '@/types/printLayout';
import { calculateTextHeight, MM_TO_PX } from '../utils/textMeasurement';

export const calculateServiceLineHeight = (layout: PrintLayout | null): number => {
  if (!layout) return 20; // Aumentato il default per essere più conservativo

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
  
  // Aggiungi altezza per il bordo superiore e padding - AUMENTATO per essere più conservativo
  const borderAndPaddingMm = 8; // Aumentato da 5 a 8mm per includere tutti gli spazi
  
  // Aggiungi un buffer di sicurezza
  const safetyBufferMm = 3;
  
  return textHeightMm + marginMm + borderAndPaddingMm + safetyBufferMm;
};
