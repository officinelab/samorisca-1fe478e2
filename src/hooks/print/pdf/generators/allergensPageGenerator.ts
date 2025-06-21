
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { Allergen, ProductFeature } from '@/types/database';
import { getAllergensPageMargins } from './allergens/allergensPageMargins';
import { renderAllergensHeader } from './allergens/allergensHeaderRenderer';
import { renderAllergen } from './allergens/allergenRenderer';
import { renderProductFeatures } from './allergens/productFeaturesRenderer';

export const generateAllergensPage = async (
  pdf: jsPDF,
  layout: PrintLayout,
  allergens: Allergen[],
  productFeatures: ProductFeature[]
): Promise<void> => {
  console.log('📄 Generating allergens page - EXACT preview replication...');
  
  if (allergens.length === 0 && productFeatures.length === 0) {
    console.log('⚠️ No allergens or product features found, skipping page');
    return;
  }
  
  // Add new page for allergens - UNA SOLA VOLTA
  pdf.addPage();
  const pageNumber = pdf.internal.pages.length - 1;
  
  // Get page dimensions and margins - IDENTICO anteprima
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margins = getAllergensPageMargins(layout, pageNumber);
  
  const marginTop = margins.marginTop;
  const marginRight = margins.marginRight;
  const marginBottom = margins.marginBottom;
  const marginLeft = margins.marginLeft;
  
  const contentWidth = pageWidth - marginLeft - marginRight;
  const maxContentHeight = pageHeight - marginTop - marginBottom;
  
  console.log('📄 Allergens page setup:', { 
    pageNumber, 
    margins: { marginTop, marginRight, marginBottom, marginLeft },
    content: { contentWidth, maxContentHeight }
  });
  
  let currentY = marginTop;
  
  // Helper function to check if we need a new page - EVITA DUPLICAZIONI
  const checkAndAddNewPage = (estimatedHeight: number): boolean => {
    if (currentY + estimatedHeight > pageHeight - marginBottom) {
      console.log('📄 Adding new allergens page due to content overflow');
      pdf.addPage();
      const newMargins = getAllergensPageMargins(layout, pdf.internal.pages.length - 1);
      currentY = newMargins.marginTop;
      return true;
    }
    return false;
  };
  
  // Render allergens header only on first page - IDENTICO anteprima
  if (pageNumber === pdf.internal.pages.length - 1) { // Solo se è la prima pagina allergeni
    currentY = renderAllergensHeader(pdf, layout, currentY, marginLeft, contentWidth);
  }
  
  // Render allergens first - IDENTICO anteprima
  for (let i = 0; i < allergens.length; i++) {
    const allergen = allergens[i];
    const estimatedHeight = 25; // Rough estimate
    
    checkAndAddNewPage(estimatedHeight);
    currentY = await renderAllergen(pdf, allergen, layout, currentY, marginLeft, contentWidth);
  }
  
  // Render product features after allergens - IDENTICO anteprima
  if (productFeatures.length > 0) {
    const estimatedFeaturesHeight = productFeatures.length * 20; // Rough estimate
    checkAndAddNewPage(estimatedFeaturesHeight);
    
    currentY = await renderProductFeatures(pdf, productFeatures, layout, currentY, marginLeft, contentWidth);
  }
  
  console.log('✅ Allergens page generation completed - EXACT preview match');
};
