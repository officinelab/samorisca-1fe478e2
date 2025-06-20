
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { addStyledText } from './textRenderer';
import { getStandardizedDimensions } from '../utils/conversionUtils';

// Service charge renderer matching the preview (no border line, updated text format)
export const addServiceChargeToPdf = (
  pdf: jsPDF,
  serviceCharge: number,
  x: number,
  y: number,
  layout: PrintLayout,
  contentWidth: number
): number => {
  const dimensions = getStandardizedDimensions(layout);
  
  console.log('💰 PDF Service charge rendering - updated format:', {
    fontSize: dimensions.pdf.serviceFontSize,
    margins: dimensions.pdfMargins.service
  });
  
  // Updated service text format without "=" and with space before €
  const serviceText = `Servizio e coperto €${serviceCharge.toFixed(2)}`;
  
  const textHeight = addStyledText(pdf, serviceText, x, y, {
    fontSize: dimensions.pdf.serviceFontSize,
    fontFamily: layout.servicePrice.fontFamily,
    fontStyle: layout.servicePrice.fontStyle,
    fontColor: layout.servicePrice.fontColor,
    alignment: layout.servicePrice.alignment,
    maxWidth: contentWidth
  });
  
  return textHeight + dimensions.pdfMargins.service.top + dimensions.pdfMargins.service.bottom;
};
