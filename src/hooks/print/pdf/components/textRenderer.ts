import jsPDF from 'jspdf';
import { hexToRgb, mapFontFamily, mapFontStyle } from '../utils/pdfUtils';

// Configuration for styled text
interface StyledTextConfig {
  fontSize: number;
  fontFamily: string;
  fontStyle: string;
  fontColor: string;
  alignment?: 'left' | 'center' | 'right';
  maxWidth?: number;
}

// Add text with proper styling and wrapping
export const addStyledText = (
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  config: StyledTextConfig
): number => {
  const color = hexToRgb(config.fontColor);
  pdf.setTextColor(color.r, color.g, color.b);
  pdf.setFontSize(config.fontSize);
  
  const mappedFont = mapFontFamily(config.fontFamily);
  const mappedStyle = mapFontStyle(config.fontStyle);
  
  try {
    pdf.setFont(mappedFont, mappedStyle);
  } catch (e) {
    console.warn(`Font ${mappedFont} with style ${mappedStyle} not available, using helvetica`);
    pdf.setFont('helvetica', mappedStyle);
  }
  
  // Handle text wrapping if maxWidth is provided
  if (config.maxWidth) {
    const lines = pdf.splitTextToSize(text, config.maxWidth);
    // ✅ CORREZIONE: Line height corretto per jsPDF (pt to mm)
    const lineHeight = config.fontSize * 0.353; // mm
    
    lines.forEach((line: string, index: number) => {
      pdf.text(line, x, y + (index * lineHeight), { align: config.alignment || 'left' });
    });
    
    return lines.length * lineHeight;
  } else {
    pdf.text(text, x, y, { align: config.alignment || 'left' });
    // ✅ CORREZIONE: Return height corretto (pt to mm)
    return config.fontSize * 0.353; // Return approximate height in mm
  }
};