
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { getPageMargins } from '../utils/marginUtils';
import { addTextToPdf } from './textGenerator';

// Generate allergens page
export const generateAllergensPage = (pdf: jsPDF, layout: PrintLayout) => {
  pdf.addPage();
  
  const margins = getPageMargins(layout, 'allergens', 4);
  
  let currentY = margins.marginTop;
  
  if (layout.allergens?.title) {
    const titleHeight = addTextToPdf(
      pdf,
      layout.allergens.title.text || 'Allergeni e Intolleranze',
      layout.allergens.title.fontSize || 18,
      layout.allergens.title.fontFamily || 'helvetica',
      layout.allergens.title.fontStyle || 'bold',
      layout.allergens.title.fontColor || '#000000',
      layout.allergens.title.alignment || 'center',
      currentY,
      210,
      margins.marginLeft,
      margins.marginRight
    );
    
    currentY += titleHeight + 15;
  }
  
  addTextToPdf(
    pdf,
    'Le informazioni sugli allergeni verranno visualizzate qui',
    12,
    'helvetica',
    'normal',
    '#666666',
    'center',
    currentY + 10,
    210,
    margins.marginLeft,
    margins.marginRight
  );
};
