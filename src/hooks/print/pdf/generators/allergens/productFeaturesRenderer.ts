
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

  console.log('🏷️ PDF Product features rendering - EXACT preview values...');
  
  let currentY = startY;
  const sectionTitleConfig = layout.productFeatures?.sectionTitle;
  const iconConfig = layout.productFeatures?.icon;
  const itemTitleConfig = layout.productFeatures?.itemTitle;
  
  // Render section title if visible and configured - IDENTICO anteprima
  if (sectionTitleConfig?.visible !== false && sectionTitleConfig?.text) {
    console.log('📝 Adding product features section title:', sectionTitleConfig.text);
    
    // Add top margin for title - USA ESATTAMENTE i valori dal layout
    const topMargin = sectionTitleConfig.margin?.top || 0;
    console.log('🏷️ Section title top margin:', topMargin, 'mm');
    currentY += topMargin;
    
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
    
    const bottomMargin = sectionTitleConfig.margin?.bottom || 0;
    console.log('🏷️ Section title bottom margin:', bottomMargin, 'mm');
    currentY += titleHeight + bottomMargin;
  }
  
  // Render product features - IDENTICO anteprima
  for (let i = 0; i < productFeatures.length; i++) {
    const feature = productFeatures[i];
    console.log('🔧 PDF Product feature rendering:', feature.title);
    
    let featureX = marginLeft;
    let featureHeight = 0;
    
    // Margine top per la prima caratteristica - USA ESATTAMENTE i valori dal layout
    if (i === 0) {
      const topMargin = iconConfig?.marginTop || 0;
      console.log('🏷️ First feature top margin:', topMargin, 'mm');
      currentY += topMargin;
    }
    
    // Icona caratteristica - IDENTICO anteprima
    if (feature.icon_url) {
      const iconSizeMm = (iconConfig?.iconSize || 16) / 3.78; // px to mm - IDENTICO
      await addSvgIconToPdf(pdf, feature.icon_url, featureX, currentY, iconSizeMm);
      const iconSpacing = (iconConfig?.iconSpacing || 4) / 3.78; // px to mm - IDENTICO
      featureX += iconSizeMm + iconSpacing;
      featureHeight = Math.max(featureHeight, iconSizeMm);
    }
    
    // Titolo caratteristica - IDENTICO anteprima
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
    
    // USA ESATTAMENTE i valori dal layout per marginBottom - IDENTICO anteprima
    const bottomMargin = iconConfig?.marginBottom || 0;
    console.log('🏷️ Feature bottom margin:', bottomMargin, 'mm');
    currentY += featureHeight + bottomMargin;
  }
  
  return currentY;
};
