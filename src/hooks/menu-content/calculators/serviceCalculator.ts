
import { PrintLayout } from '@/types/printLayout';
import { calculateTextHeight, MM_TO_PX } from '../utils/textMeasurement';

export const calculateServiceLineHeight = (layout: PrintLayout | null): number => {
  if (!layout) return 18; // Ridotto da 20 a 18mm per essere più preciso

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
    1.4 // Ridotto da 1.5 a 1.4
  );
  
  const textHeightMm = textHeightPx / MM_TO_PX;
  const marginMm = serviceConfig.margin.top + serviceConfig.margin.bottom;
  
  // Ridotto l'altezza per bordo e padding da 8 a 6mm
  const borderAndPaddingMm = 6;
  
  // Ridotto il buffer di sicurezza da 3 a 2mm
  const safetyBufferMm = 2;
  
  const totalHeight = textHeightMm + marginMm + borderAndPaddingMm + safetyBufferMm;
  
  console.log('🔧 Calcolo altezza linea servizio:', {
    textHeightMm: textHeightMm.toFixed(2),
    marginMm: marginMm.toFixed(2),
    borderAndPaddingMm,
    safetyBufferMm,
    totalHeight: totalHeight.toFixed(2)
  });
  
  return totalHeight;
};
