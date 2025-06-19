
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { addStyledText } from './textRenderer';

// Add service charge line to PDF with proper positioning
export const addServiceChargeToPdf = (
  pdf: jsPDF,
  serviceCharge: number,
  x: number,
  y: number,
  layout: PrintLayout,
  contentWidth: number
): number => {
  const serviceConfig = layout.servicePrice;
  
  // Draw border line
  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(0.1);
  pdf.line(x, y, x + contentWidth, y);
  
  const textY = y + 6;
  const serviceText = `Servizio e Coperto = €${serviceCharge.toFixed(2)}`;
  
  const textHeight = addStyledText(pdf, serviceText, x, textY, {
    fontSize: serviceConfig.fontSize,
    fontFamily: serviceConfig.fontFamily,
    fontStyle: serviceConfig.fontStyle,
    fontColor: serviceConfig.fontColor,
    alignment: serviceConfig.alignment,
    maxWidth: contentWidth
  });
  
  return textHeight + serviceConfig.margin.top + serviceConfig.margin.bottom + 6;
};
