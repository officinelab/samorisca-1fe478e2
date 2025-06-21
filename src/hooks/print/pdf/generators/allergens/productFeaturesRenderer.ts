
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
  
  // Render custom title if provided
  const customTitle = layout.productFeatures?.sectionTitle?.text;
  if (customTitle) {
    console.log('📝 Adding custom product features title:', customTitle);
    
    // Add top margin for title
    currentY += layout.productFeatures.sectionTitle.margin?.top || 5;
    
    const titleHeight = addStyledText(
      pdf,
      customTitle,
      marginLeft + (layout.productFeatures.sectionTitle.margin?.left || 0),
      currentY,
      {
        fontSize: layout.productFeatures.sectionTitle.fontSize || 18,
        fontFamily: layout.productFeatures.sectionTitle.fontFamily || 'helvetica',
        fontStyle: layout.productFeatures.sectionTitle.fontStyle || 'bold',
        fontColor: layout.productFeatures.sectionTitle.fontColor || '#000000',
        alignment: layout.productFeatures.sectionTitle.alignment || 'left',
        maxWidth: contentWidth - (layout.productFeatures.sectionTitle.margin?.left || 0) - (layout.productFeatures.sectionTitle.margin?.right || 0)
      }
    );
    
    currentY += titleHeight + (layout.productFeatures.sectionTitle.margin?.bottom || 10);
  }
  
  // Render product features
  for (let i = 0; i < productFeatures.length; i++) {
    const feature = productFeatures[i];
    console.log('🔧 Adding product feature:', feature.title);
    
    let featureX = marginLeft;
    let featureHeight = 0;
    
    // Margine top per la prima caratteristica (solo se non c'è il titolo)
    if (i === 0 && !customTitle) {
      currentY += layout.productFeatures.icon.marginTop || 0;
    }
    
    // Icona caratteristica
    if (feature.icon_url) {
      const iconSizeMm = (layout.productFeatures.icon.iconSize || 16) / 3.78; // px to mm
      await addSvgIconToPdf(pdf, feature.icon_url, featureX, currentY, iconSizeMm);
      featureX += iconSizeMm + 3; // 3mm gap
      featureHeight = Math.max(featureHeight, iconSizeMm);
    }
    
    // Titolo caratteristica (feature title, not section title)
    const titleHeight = addStyledText(
      pdf,
      feature.title,
      featureX,
      currentY,
      {
        fontSize: layout.productFeatures.itemTitle?.fontSize || 12,
        fontFamily: layout.productFeatures.itemTitle?.fontFamily || 'helvetica',
        fontStyle: layout.productFeatures.itemTitle?.fontStyle || 'normal',
        fontColor: layout.productFeatures.itemTitle?.fontColor || '#000000',
        alignment: layout.productFeatures.itemTitle?.alignment || 'left',
        maxWidth: contentWidth - (featureX - marginLeft)
      }
    );
    featureHeight = Math.max(featureHeight, titleHeight);
    
    currentY += featureHeight + (layout.productFeatures.icon.marginBottom || 5);
  }
  
  return currentY;
};
