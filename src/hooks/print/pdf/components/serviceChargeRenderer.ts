import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { addStyledText } from './textRenderer';

// Add service charge line to PDF with dimensions identical to preview
export const addServiceChargeToPdf = (
  pdf: jsPDF,
  serviceCharge: number,
  x: number,
  y: number,
  layout: PrintLayout,
  contentWidth: number
): number => {
  console.log('💰 PDF Service charge rendering');
  
  // Draw border line (identico all'anteprima)
  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(0.1);
  pdf.line(x, y, x + contentWidth, y);
  
  // ✅ USA MARGINI DIRETTI DAL LAYOUT
  const textY = y + layout.servicePrice.margin.top;
  const serviceText = `Servizio e Coperto = €${serviceCharge.toFixed(2)}`;
  
  const textHeight = addStyledText(pdf, serviceText, x, textY, {
    fontSize: layout.servicePrice.fontSize, // USA PT DIRETTO
    fontFamily: layout.servicePrice.fontFamily,
    fontStyle: layout.servicePrice.fontStyle,
    fontColor: layout.servicePrice.fontColor,
    alignment: layout.servicePrice.alignment,
    maxWidth: contentWidth
  });
  
  return textHeight + layout.servicePrice.margin.top + layout.servicePrice.margin.bottom;
};