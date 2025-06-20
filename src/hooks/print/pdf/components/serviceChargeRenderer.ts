
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { addStyledText } from './textRenderer';
import { getStandardizedDimensions } from '../utils/conversionUtils';

// Service charge renderer - solo per pagine dispari
export const addServiceChargeToPdf = (
  pdf: jsPDF,
  serviceCharge: number,
  x: number,
  y: number,
  layout: PrintLayout,
  contentWidth: number,
  pageNumber: number
): number => {
  // Mostra il servizio e coperto solo nelle pagine dispari
  if (pageNumber % 2 === 0) {
    return 0; // Nessun contenuto aggiunto per le pagine pari
  }

  const dimensions = getStandardizedDimensions(layout);
  
  console.log('💰 PDF Service charge rendering - solo pagine dispari:', {
    pageNumber,
    fontSize: dimensions.pdf.serviceFontSize,
    margins: dimensions.pdfMargins.service
  });
  
  const textY = y; // Rimossa la linea, quindi iniziamo direttamente con il testo
  const serviceText = `Servizio e coperto €${serviceCharge.toFixed(2)}`;
  
  const textHeight = addStyledText(pdf, serviceText, x, textY, {
    fontSize: dimensions.pdf.serviceFontSize,
    fontFamily: layout.servicePrice.fontFamily,
    fontStyle: layout.servicePrice.fontStyle,
    fontColor: layout.servicePrice.fontColor,
    alignment: layout.servicePrice.alignment,
    maxWidth: contentWidth
  });
  
  return textHeight + dimensions.pdfMargins.service.top + dimensions.pdfMargins.service.bottom;
};
