
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
  console.log('📄 Starting allergens page generation matching preview...');
  
  if (allergens.length === 0 && productFeatures.length === 0) {
    console.log('⚠️ No allergens or product features found, skipping allergens page');
    return;
  }
  
  // Add new page for allergens
  pdf.addPage();
  const pageNumber = pdf.internal.pages.length - 1;
  
  // Get page dimensions and margins matching preview
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margins = getAllergensPageMargins(layout, pageNumber);
  
  const marginTop = margins.marginTop;
  const marginRight = margins.marginRight;
  const marginBottom = margins.marginBottom;
  const marginLeft = margins.marginLeft;
  
  const contentWidth = pageWidth - marginLeft - marginRight;
  
  console.log('📄 Allergens page margins:', { marginTop, marginRight, marginBottom, marginLeft });
  console.log('📄 Content area:', { contentWidth });
  
  let currentY = marginTop;
  
  // Render allergens header (title and description)
  currentY = renderAllergensHeader(pdf, layout, currentY, marginLeft, contentWidth);
  
  // Render allergens with exact preview spacing
  for (const allergen of allergens) {
    currentY = await renderAllergen(pdf, allergen, layout, currentY, marginLeft, contentWidth);
  }
  
  // Render product features with exact preview spacing
  if (productFeatures.length > 0) {
    currentY = await renderProductFeatures(pdf, productFeatures, layout, currentY, marginLeft, contentWidth);
  }
  
  console.log('✅ Allergens page generation completed matching preview');
};
