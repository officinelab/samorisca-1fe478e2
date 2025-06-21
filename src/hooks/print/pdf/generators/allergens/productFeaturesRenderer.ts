
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
  const sectionTitleConfig = layout.productFeatures?.sectionTitle;
  const iconConfig = layout.productFeatures?.icon;
  const itemTitleConfig = layout.productFeatures?.itemTitle;
  
  // Render section title if visible and configured
  if (sectionTitleConfig?.visible !== false && sectionTitleConfig?.text) {
    console.log('📝 Adding product features section title:', sectionTitleConfig.text);
    
    // Add top margin for title - usa valori esatti dal layout
    currentY += sectionTitleConfig.margin?.top || 0;
    
    const titleHeight = addStyledText(
      pdf,
      sectionTitleConfig.text,
      marginLeft + (sectionTitleConfig.margin?.left || 0),
      currentY,
      {
        fontSize: sectionTitleConfig.fontSize || 18,
        fontFamily: sectionTitleConfig.fontFamily || 'helvetica',
        fontStyle: sectionTitleConfig.fontStyle || 'bold',
        fontColor: sectionTitleConfig.fontColor || '#000000',
        alignment: sectionTitleConfig.alignment || 'left',
        maxWidth: contentWidth - (sectionTitleConfig.margin?.left || 0) - (sectionTitleConfig.margin?.right || 0)
      }
    );
    
    currentY += titleHeight + (sectionTitleConfig.margin?.bottom || 0);
  }
  
  // Render product features
  for (let i = 0; i < productFeatures.length; i++) {
    const feature = productFeatures[i];
    console.log('🔧 Adding product feature:', feature.title);
    
    let featureX = marginLeft;
    let featureHeight = 0;
    
    // Margine top per la prima caratteristica - usa valori esatti dal layout
    if (i === 0) {
      currentY += iconConfig?.marginTop || 0;
    }
    
    // Icona caratteristica
    if (feature.icon_url) {
      const iconSizeMm = (iconConfig?.iconSize || 16) / 3.78; // px to mm
      await addSvgIconToPdf(pdf, feature.icon_url, featureX, currentY, iconSizeMm);
      featureX += iconSizeMm + ((iconConfig?.iconSpacing || 4) / 3.78); // px to mm spacing - usa valori esatti
      featureHeight = Math.max(featureHeight, iconSizeMm);
    }
    
    // Titolo caratteristica (item title, not section title)
    if (itemTitleConfig?.visible !== false) {
      const titleHeight = addStyledText(
        pdf,
        feature.title,
        featureX + (itemTitleConfig?.margin?.left || 0),
        currentY + (itemTitleConfig?.margin?.top || 0),
        {
          fontSize: itemTitleConfig?.fontSize || 14,
          fontFamily: itemTitleConfig?.fontFamily || 'helvetica',
          fontStyle: itemTitleConfig?.fontStyle || 'normal',
          fontColor: itemTitleConfig?.fontColor || '#000000',
          alignment: itemTitleConfig?.alignment || 'left',
          maxWidth: contentWidth - (featureX - marginLeft) - (itemTitleConfig?.margin?.left || 0) - (itemTitleConfig?.margin?.right || 0)
        }
      );
      featureHeight = Math.max(featureHeight, titleHeight + (itemTitleConfig?.margin?.top || 0) + (itemTitleConfig?.margin?.bottom || 0));
    }
    
    // Usa valori esatti dal layout per marginBottom
    currentY += featureHeight + (iconConfig?.marginBottom || 0);
  }
  
  return currentY;
};
