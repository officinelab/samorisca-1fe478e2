import jsPDF from 'jspdf';
import { mapFontFamily, mapFontStyle, hexToRgb } from '../utils/pdfUtils';

// Function for adding text with proper styling
export const addTextToPdf = (
  pdf: jsPDF,
  text: string,
  fontSize: number,
  fontFamily: string,
  fontStyle: string,
  fontColor: string,
  alignment: 'left' | 'center' | 'right',
  y: number,
  pageWidth: number,
  leftMargin: number,
  rightMargin: number
) => {
  const color = hexToRgb(fontColor);
  pdf.setTextColor(color.r, color.g, color.b);
  pdf.setFontSize(fontSize);
  
  const mappedFont = mapFontFamily(fontFamily);
  const mappedStyle = mapFontStyle(fontStyle);
  
  try {
    pdf.setFont(mappedFont, mappedStyle);
  } catch (e) {
    console.warn(`Font ${mappedFont} with style ${mappedStyle} not available, using helvetica`);
    pdf.setFont('helvetica', mappedStyle);
  }
  
  let textX = leftMargin;
  const contentWidth = pageWidth - leftMargin - rightMargin;
  
  switch (alignment) {
    case 'left':
      textX = leftMargin;
      break;
    case 'right':
      textX = pageWidth - rightMargin;
      break;
    case 'center':
    default:
      textX = leftMargin + (contentWidth / 2);
      break;
  }
  
  pdf.text(text, textX, y, { align: alignment });
  
  return fontSize * 0.35;
};
