
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { Allergen, ProductFeature } from '@/types/database';
import { getAllergensPageMargins } from './allergens/allergensPageMargins';
import { renderAllergensHeader } from './allergens/allergensHeaderRenderer';
import { renderAllergen } from './allergens/allergenRenderer';
import { renderProductFeatures } from './allergens/productFeaturesRenderer';
import { addStyledText } from '../components/textRenderer';

export const generateAllergensPage = async (
  pdf: jsPDF,
  layout: PrintLayout,
  allergens: Allergen[],
  productFeatures: ProductFeature[]
): Promise<void> => {
  console.log('📄 Starting allergens page generation...');
  
  if (allergens.length === 0 && productFeatures.length === 0) {
    console.log('⚠️ No allergens or product features found, skipping allergens page');
    return;
  }
  
  // Add new page for allergens
  pdf.addPage();
  const pageNumber = pdf.internal.pages.length - 1;
  
  // Get page dimensions and margins
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margins = getAllergensPageMargins(layout, pageNumber);
  
  const marginTop = margins.marginTop;
  const marginRight = margins.marginRight;
  const marginBottom = margins.marginBottom;
  const marginLeft = margins.marginLeft;
  
  const contentWidth = pageWidth - marginLeft - marginRight;
  const maxContentHeight = pageHeight - marginTop - marginBottom;
  
  console.log('📄 Allergens page margins:', { marginTop, marginRight, marginBottom, marginLeft });
  console.log('📄 Content area:', { contentWidth, maxContentHeight });
  
  let currentY = marginTop;
  let currentPageNumber = pageNumber;
  let isFirstPage = true;
  
  // Helper function to check if we need a new page
  const checkAndAddNewPage = (estimatedHeight: number): boolean => {
    if (currentY + estimatedHeight > pageHeight - marginBottom) {
      pdf.addPage();
      currentPageNumber = pdf.internal.pages.length - 1;
      const newMargins = getAllergensPageMargins(layout, currentPageNumber);
      currentY = newMargins.marginTop;
      console.log('📄 Added new page, current Y reset to:', currentY);
      return true;
    }
    return false;
  };
  
  // Helper function to render section title for product features
  const renderProductFeaturesSectionTitle = async (): Promise<number> => {
    const sectionTitleConfig = layout.productFeatures?.sectionTitle;
    if (sectionTitleConfig?.visible !== false && sectionTitleConfig?.text) {
      console.log('📝 Adding product features section title:', sectionTitleConfig.text);
      
      // Add top margin for title
      currentY += sectionTitleConfig.margin?.top || 5;
      
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
      
      currentY += titleHeight + (sectionTitleConfig.margin?.bottom || 10);
      return titleHeight + (sectionTitleConfig.margin?.top || 5) + (sectionTitleConfig.margin?.bottom || 10);
    }
    return 0;
  };
  
  // Render allergens header (title and description) only on first page
  if (isFirstPage) {
    currentY = renderAllergensHeader(pdf, layout, currentY, marginLeft, contentWidth);
  }
  
  // Render allergens first
  for (let i = 0; i < allergens.length; i++) {
    const allergen = allergens[i];
    const estimatedHeight = 25; // Rough estimate for allergen height
    
    // Check if we need a new page
    const needsNewPage = checkAndAddNewPage(estimatedHeight);
    if (needsNewPage) {
      isFirstPage = false;
    }
    
    currentY = await renderAllergen(pdf, allergen, layout, currentY, marginLeft, contentWidth);
  }
  
  // Render product features directly after allergens
  if (productFeatures.length > 0) {
    let productFeaturesSectionRendered = false;
    
    for (let i = 0; i < productFeatures.length; i++) {
      const feature = productFeatures[i];
      const iconConfig = layout.productFeatures?.icon;
      
      // Estimate height for this feature (icon + title + margins)
      const estimatedFeatureHeight = Math.max(
        (iconConfig?.iconSize || 16) / 3.78, // icon height in mm
        6 // minimum text height
      ) + (iconConfig?.marginTop || 0) + (iconConfig?.marginBottom || 0);
      
      // If this is the first feature, add section title height to estimate
      const sectionTitleHeight = !productFeaturesSectionRendered ? 25 : 0; // estimated section title height
      const totalEstimatedHeight = estimatedFeatureHeight + sectionTitleHeight;
      
      // Check if we need a new page
      const needsNewPage = checkAndAddNewPage(totalEstimatedHeight);
      
      // If we moved to a new page OR this is the first feature, render section title
      if (needsNewPage || !productFeaturesSectionRendered) {
        await renderProductFeaturesSectionTitle();
        productFeaturesSectionRendered = true;
      }
      
      // Now render the individual feature
      let featureX = marginLeft;
      let featureHeight = 0;
      
      // Add top margin for first feature
      if (i === 0 && !needsNewPage) {
        currentY += iconConfig?.marginTop || 0;
      }
      
      // Render feature icon
      if (feature.icon_url) {
        const iconSizeMm = (iconConfig?.iconSize || 16) / 3.78; // px to mm
        // Note: addSvgIconToPdf would need to be imported and implemented
        featureX += iconSizeMm + ((iconConfig?.iconSpacing || 4) / 3.78);
        featureHeight = Math.max(featureHeight, iconSizeMm);
      }
      
      // Render feature title
      const itemTitleConfig = layout.productFeatures?.itemTitle;
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
      
      currentY += featureHeight + (iconConfig?.marginBottom || 0);
      
      console.log(`🔧 Rendered product feature "${feature.title}" at Y: ${currentY.toFixed(1)}mm`);
    }
  }
  
  console.log('✅ Allergens page generation completed');
};
