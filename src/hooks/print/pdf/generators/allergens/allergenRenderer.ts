
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { Allergen } from '@/types/database';
import { addStyledText } from '../../components/textRenderer';
import { addSvgIconToPdf } from '../../components/iconRenderer';

export const renderAllergen = async (
  pdf: jsPDF,
  allergen: Allergen,
  layout: PrintLayout,
  startY: number,
  marginLeft: number,
  contentWidth: number
): Promise<number> => {
  console.log('🏷️ Adding allergen:', allergen.title);
  
  let currentY = startY;
  let maxItemHeight = 0;
  
  // Calcola la posizione per l'icona, numero e titolo sulla prima riga
  let itemX = marginLeft;
  
  // Icona allergene
  if (allergen.icon_url) {
    const iconSizeMm = (layout.allergens.item.iconSize || 16) / 3.78; // px to mm
    await addSvgIconToPdf(pdf, allergen.icon_url, itemX, currentY, iconSizeMm);
    itemX += iconSizeMm + 3; // 3mm gap
    maxItemHeight = Math.max(maxItemHeight, iconSizeMm);
  }
  
  // Numero allergene
  const numberWidth = 10; // mm
  const numberHeight = addStyledText(
    pdf,
    allergen.number.toString(),
    itemX,
    currentY,
    {
      fontSize: layout.allergens.item.number.fontSize || 12,
      fontFamily: layout.allergens.item.number.fontFamily || 'helvetica',
      fontStyle: layout.allergens.item.number.fontStyle || 'bold',
      fontColor: layout.allergens.item.number.fontColor || '#000000',
      alignment: layout.allergens.item.number.alignment || 'left'
    }
  );
  itemX += numberWidth;
  maxItemHeight = Math.max(maxItemHeight, numberHeight);
  
  // Titolo allergene
  const titleHeight = addStyledText(
    pdf,
    allergen.title,
    itemX,
    currentY,
    {
      fontSize: layout.allergens.item.title.fontSize || 12,
      fontFamily: layout.allergens.item.title.fontFamily || 'helvetica',
      fontStyle: layout.allergens.item.title.fontStyle || 'normal',
      fontColor: layout.allergens.item.title.fontColor || '#000000',
      alignment: layout.allergens.item.title.alignment || 'left',
      maxWidth: contentWidth - (itemX - marginLeft)
    }
  );
  maxItemHeight = Math.max(maxItemHeight, titleHeight);
  
  currentY += maxItemHeight;
  
  // Descrizione allergene (se presente) sulla seconda riga
  if (allergen.description) {
    currentY += 2; // Piccolo spazio tra titolo e descrizione
    
    const descHeight = addStyledText(
      pdf,
      allergen.description,
      marginLeft + (allergen.icon_url ? ((layout.allergens.item.iconSize || 16) / 3.78) + 3 : 0),
      currentY,
      {
        fontSize: layout.allergens.item.description.fontSize || 10,
        fontFamily: layout.allergens.item.description.fontFamily || 'helvetica',
        fontStyle: layout.allergens.item.description.fontStyle || 'normal',
        fontColor: layout.allergens.item.description.fontColor || '#666666',
        alignment: layout.allergens.item.description.alignment || 'left',
        maxWidth: contentWidth - (allergen.icon_url ? ((layout.allergens.item.iconSize || 16) / 3.78) + 3 : 0)
      }
    );
    
    currentY += descHeight;
  }
  
  // Spazio tra allergeni
  currentY += layout.allergens.item.spacing || 5;
  
  return currentY;
};
