import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { addStyledText } from './textRenderer';
import { getStandardizedDimensions } from '@/hooks/print/pdf/utils/conversionUtils';

// Add service charge line to PDF with dimensions identical to preview
export const addServiceChargeToPdf = (
  pdf: jsPDF,
  serviceCharge: number,
  x: number,
  y: number,
  layout: PrintLayout,
  contentWidth: number
): number => {
  const dimensions = getStandardizedDimensions(layout);
  
  console.log('💰 PDF Service charge rendering con dimensioni standardizzate:', {
    fontSize: dimensions.pdf.serviceFontSize,
    margins: dimensions.pdfMargins.service
  });
  
  // Draw border line (identico all'anteprima)
  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(0.1);
  pdf.line(x, y, x + contentWidth, y);
  
  const textY = y + 6; // Come nell'anteprima
  const serviceText = `Servizio e Coperto = €${serviceCharge.toFixed(2)}`;
  
  const textHeight = addStyledText(pdf, serviceText, x, textY, {
    fontSize: dimensions.pdf.serviceFontSize, // USA DIMENSIONI STANDARDIZZATE
    fontFamily: layout.servicePrice.fontFamily,
    fontStyle: layout.servicePrice.fontStyle,
    fontColor: layout.servicePrice.fontColor,
    alignment: layout.servicePrice.alignment,
    maxWidth: contentWidth
  });
  
  return textHeight + dimensions.pdfMargins.service.top + dimensions.pdfMargins.service.bottom + 6;
};