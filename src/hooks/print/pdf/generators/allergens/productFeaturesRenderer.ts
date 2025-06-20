
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { ProductFeature } from '@/types/database';
import { addStyledText } from '../../components/textRenderer';
import { addSvgIconToPdf } from '../../components/iconRenderer';

export const renderProductFeatures = async (
  pdf: jsPDF,
  productFeatures: ProductFeature[],
  layout: PrintLayout,
  startY: number,
  marginLeft: number,
  contentWidth: number
): Promise<number> => {
  if (productFeatures.length === 0) {
    return startY;
  }

  console.log('🏷️ Adding product features section...');
  
  let currentY = startY;
  
  for (let i = 0; i < productFeatures.length; i++) {
    const feature = productFeatures[i];
    console.log('🔧 Adding product feature:', feature.title);
    
    let featureX = marginLeft;
    let featureHeight = 0;
    
    // Margine top per la prima caratteristica
    if (i === 0) {
      currentY += layout.productFeatures.icon.marginTop || 0;
    }
    
    // Icona caratteristica
    if (feature.icon_url) {
      const iconSizeMm = (layout.productFeatures.icon.iconSize || 16) / 3.78; // px to mm
      await addSvgIconToPdf(pdf, feature.icon_url, featureX, currentY, iconSizeMm);
      featureX += iconSizeMm + 3; // 3mm gap
      featureHeight = Math.max(featureHeight, iconSizeMm);
    }
    
    // Titolo caratteristica
    const titleHeight = addStyledText(
      pdf,
      feature.title,
      featureX,
      currentY,
      {
        fontSize: layout.productFeatures.title.fontSize || 12,
        fontFamily: layout.productFeatures.title.fontFamily || 'helvetica',
        fontStyle: layout.productFeatures.title.fontStyle || 'normal',
        fontColor: layout.productFeatures.title.fontColor || '#000000',
        alignment: layout.productFeatures.title.alignment || 'left',
        maxWidth: contentWidth - (featureX - marginLeft)
      }
    );
    featureHeight = Math.max(featureHeight, titleHeight);
    
    currentY += featureHeight + (layout.productFeatures.icon.marginBottom || 5);
  }
  
  return currentY;
};
