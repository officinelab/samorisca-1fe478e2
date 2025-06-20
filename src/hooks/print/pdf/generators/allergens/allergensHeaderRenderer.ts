
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { addStyledText } from '../../components/textRenderer';

export const renderAllergensHeader = (
  pdf: jsPDF,
  layout: PrintLayout,
  startY: number,
  marginLeft: number,
  contentWidth: number
): number => {
  let currentY = startY;
  
  // Titolo Menu Allergeni
  if (layout.allergens?.title) {
    const titleHeight = addStyledText(
      pdf,
      layout.allergens.title.text || 'Allergeni e Intolleranze',
      marginLeft,
      currentY,
      {
        fontSize: layout.allergens.title.fontSize || 18,
        fontFamily: layout.allergens.title.fontFamily || 'helvetica',
        fontStyle: layout.allergens.title.fontStyle || 'bold',
        fontColor: layout.allergens.title.fontColor || '#000000',
        alignment: layout.allergens.title.alignment || 'center',
        maxWidth: contentWidth
      }
    );
    
    currentY += titleHeight + (layout.allergens.title.margin?.bottom || 10);
  }
  
  // Descrizione Menu Allergeni
  if (layout.allergens?.description) {
    const descriptionHeight = addStyledText(
      pdf,
      layout.allergens.description.text || 'Lista completa degli allergeni presenti nei nostri prodotti',
      marginLeft,
      currentY,
      {
        fontSize: layout.allergens.description.fontSize || 12,
        fontFamily: layout.allergens.description.fontFamily || 'helvetica',
        fontStyle: layout.allergens.description.fontStyle || 'normal',
        fontColor: layout.allergens.description.fontColor || '#333333',
        alignment: layout.allergens.description.alignment || 'left',
        maxWidth: contentWidth
      }
    );
    
    currentY += descriptionHeight + (layout.allergens.description.margin?.bottom || 10);
  }
  
  // Spazio prima degli allergeni
  currentY += 5;
  
  return currentY;
};
