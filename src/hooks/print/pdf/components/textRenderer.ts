
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

// Text renderer con conversioni IDENTICHE all'anteprima
export const addStyledText = (
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  config: StyledTextConfig
): number => {
  const color = hexToRgb(config.fontColor);
  pdf.setTextColor(color.r, color.g, color.b);
  pdf.setFontSize(config.fontSize); // jsPDF usa pt nativamente
  
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
    
    // ✅ LINE HEIGHT CORRETTO per jsPDF - IDENTICO anteprima
    const lineHeightMm = config.fontSize * 0.352778 * 1.4; // pt→mm con line-height 1.4
    
    lines.forEach((line: string, index: number) => {
      pdf.text(line, x, y + (index * lineHeightMm), { align: config.alignment || 'left' });
    });
    
    return lines.length * lineHeightMm;
  } else {
    pdf.text(text, x, y, { align: config.alignment || 'left' });
    
    // ✅ Return height corretto pt→mm - IDENTICO anteprima
    return config.fontSize * 0.352778; // pt→mm conversion
  }
};
