
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { getPageMargins } from '../utils/marginUtils';
import { addImageToPdf } from './imageGenerator';
import { addTextToPdf } from './textGenerator';

// Generate first cover page
export const generateCoverPage1 = async (pdf: jsPDF, layout: PrintLayout) => {
  const cover = layout.cover;
  const margins = getPageMargins(layout, 'cover');
  
  const pageWidth = 210;
  const pageHeight = 297;
  
  let currentY = margins.marginTop;
  
  // Logo
  if (cover.logo?.visible && cover.logo?.imageUrl) {
    currentY += cover.logo.marginTop || 0;
    
    const logoAlignment = cover.logo.alignment || 'center';
    const logoMaxWidth = cover.logo.maxWidth || 80;
    const logoMaxHeight = cover.logo.maxHeight || 50;
    
    const logoHeight = await addImageToPdf(
      pdf,
      cover.logo.imageUrl,
      currentY,
      logoMaxWidth,
      logoMaxHeight,
      logoAlignment,
      pageWidth,
      pageHeight,
      margins.marginLeft,
      margins.marginRight,
      margins.marginTop,
      margins.marginBottom
    );
    
    currentY += logoHeight + (cover.logo.marginBottom || 0);
  }
  
  // Title
  if (cover.title?.visible && cover.title?.menuTitle) {
    currentY += cover.title.margin?.top || 0;
    
    const titleHeight = addTextToPdf(
      pdf,
      cover.title.menuTitle,
      cover.title.fontSize || 22,
      cover.title.fontFamily || 'helvetica',
      cover.title.fontStyle || 'normal',
      cover.title.fontColor || '#000000',
      cover.title.alignment || 'center',
      currentY,
      pageWidth,
      margins.marginLeft,
      margins.marginRight
    );
    
    currentY += titleHeight + (cover.title.margin?.bottom || 0);
  }
  
  // Subtitle
  if (cover.subtitle?.visible && cover.subtitle?.menuSubtitle) {
    currentY += cover.subtitle.margin?.top || 0;
    
    addTextToPdf(
      pdf,
      cover.subtitle.menuSubtitle,
      cover.subtitle.fontSize || 16,
      cover.subtitle.fontFamily || 'helvetica',
      cover.subtitle.fontStyle || 'normal',
      cover.subtitle.fontColor || '#000000',
      cover.subtitle.alignment || 'center',
      currentY,
      pageWidth,
      margins.marginLeft,
      margins.marginRight
    );
  }
};

// Generate second cover page (empty)
export const generateCoverPage2 = (pdf: jsPDF) => {
  pdf.addPage();
};
