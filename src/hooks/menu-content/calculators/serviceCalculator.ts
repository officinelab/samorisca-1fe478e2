
import { PrintLayout } from '@/types/printLayout';
import { MM_TO_PX } from '../utils/textMeasurement';

export const calculateServiceLineHeight = (layout: PrintLayout | null): number => {
  if (!layout?.servicePrice) {
    return 18; // Default height in mm se non c'è configurazione
  }

  const serviceConfig = layout.servicePrice;
  
  // Calcola l'altezza del testo basata sulla dimensione del font
  // Conversione da pt a px: 1pt = 1.333px
  const fontSizePx = serviceConfig.fontSize * 1.333;
  
  // Altezza base del testo con line-height di 1.4 (standard web)
  const textHeightPx = fontSizePx * 1.4;
  
  // Converti l'altezza del testo in mm
  const textHeightMm = textHeightPx / MM_TO_PX;
  
  // Aggiungi i margini configurati
  const marginMm = serviceConfig.margin.top + serviceConfig.margin.bottom;
  
  // Padding interno standardizzato: 8px sopra e sotto (convertiti in mm)
  const internalPaddingMm = (8 * 2) / MM_TO_PX; // 16px totali convertiti in mm
  
  // Margine di sicurezza per evitare sovrapposizioni
  const safetyMarginMm = 2;
  
  const totalHeight = textHeightMm + marginMm + internalPaddingMm + safetyMarginMm;
  
  console.log('🔧 Calcolo altezza linea servizio (serviceCalculator):', {
    fontSize: serviceConfig.fontSize,
    fontSizePx: fontSizePx.toFixed(2),
    textHeightPx: textHeightPx.toFixed(2),
    textHeightMm: textHeightMm.toFixed(2),
    marginTopMm: serviceConfig.margin.top,
    marginBottomMm: serviceConfig.margin.bottom,
    marginMm: marginMm.toFixed(2),
    internalPaddingMm: internalPaddingMm.toFixed(2),
    safetyMarginMm,
    totalHeight: totalHeight.toFixed(2),
    fontFamily: serviceConfig.fontFamily,
    alignment: serviceConfig.alignment
  });
  
  return totalHeight;
};
