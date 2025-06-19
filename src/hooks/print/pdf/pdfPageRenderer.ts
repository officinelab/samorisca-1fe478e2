
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { addCategoryToPdf, addCategoryNotesToPdf, addProductToPdf, addServiceChargeToPdf } from './menuContentRenderer';

interface PageContent {
  pageNumber: number;
  categories: {
    category: Category;
    notes: CategoryNote[];
    products: Product[];
    isRepeatedTitle: boolean;
  }[];
  serviceCharge: number;
}

// Get page margins based on page type and number
const getPageMargins = (
  layout: PrintLayout, 
  pageType: 'cover' | 'content' | 'allergens',
  pageNumber?: number
) => {
  const page = layout.page;

  switch (pageType) {
    case 'cover':
      return {
        marginTop: page.coverMarginTop,
        marginRight: page.coverMarginRight,
        marginBottom: page.coverMarginBottom,
        marginLeft: page.coverMarginLeft
      };

    case 'content':
      if (page.useDistinctMarginsForPages && pageNumber) {
        const isOddPage = pageNumber % 2 === 1;
        if (isOddPage && page.oddPages) {
          return page.oddPages;
        } else if (!isOddPage && page.evenPages) {
          return page.evenPages;
        }
      }
      return {
        marginTop: page.marginTop,
        marginRight: page.marginRight,
        marginBottom: page.marginBottom,
        marginLeft: page.marginLeft
      };

    case 'allergens':
      if (page.useDistinctMarginsForAllergensPages && pageNumber) {
        const isOddPage = pageNumber % 2 === 1;
        if (isOddPage && page.allergensOddPages) {
          return page.allergensOddPages;
        } else if (!isOddPage && page.allergensEvenPages) {
          return page.allergensEvenPages;
        }
      }
      return {
        marginTop: page.allergensMarginTop,
        marginRight: page.allergensMarginRight,
        marginBottom: page.allergensMarginBottom,
        marginLeft: page.allergensMarginLeft
      };

    default:
      return {
        marginTop: page.marginTop,
        marginRight: page.marginRight,
        marginBottom: page.marginBottom,
        marginLeft: page.marginLeft
      };
  }
};

// Generate a single menu content page in PDF
export const generateMenuContentPage = (
  pdf: jsPDF,
  page: PageContent,
  layout: PrintLayout
): void => {
  console.log(`📄 Generating PDF page ${page.pageNumber} with ${page.categories.length} category sections`);
  
  // Add new page if this is not the first page being added
  if (page.pageNumber > 1) {
    pdf.addPage();
  }
  
  const margins = getPageMargins(layout, 'content', page.pageNumber);
  const pageWidth = 210; // A4 width in mm
  const contentWidth = pageWidth - margins.marginLeft - margins.marginRight;
  
  let currentY = margins.marginTop;
  const maxY = 297 - margins.marginBottom; // A4 height minus bottom margin
  
  console.log(`📐 Page ${page.pageNumber} margins:`, margins);
  console.log(`📐 Content width: ${contentWidth}mm, starting Y: ${currentY}mm`);
  
  // Render each category section
  page.categories.forEach((categorySection, sectionIndex) => {
    // Category title and notes (only if not repeated)
    if (!categorySection.isRepeatedTitle) {
      // Add spacing between categories if not the first section
      if (sectionIndex > 0) {
        currentY += layout.spacing.betweenCategories;
      }
      
      // Category title
      const categoryHeight = addCategoryToPdf(
        pdf,
        categorySection.category,
        margins.marginLeft,
        currentY,
        layout,
        contentWidth
      );
      currentY += categoryHeight;
      
      // Category notes
      if (categorySection.notes.length > 0) {
        const notesHeight = addCategoryNotesToPdf(
          pdf,
          categorySection.notes,
          margins.marginLeft,
          currentY,
          layout,
          contentWidth
        );
        currentY += notesHeight + 5; // 5mm spacing after notes
      }
    }
    
    // Render products
    categorySection.products.forEach((product, productIndex) => {
      const isLastProduct = productIndex === categorySection.products.length - 1;
      
      const productHeight = addProductToPdf(
        pdf,
        product,
        margins.marginLeft,
        currentY,
        layout,
        contentWidth,
        isLastProduct
      );
      
      currentY += productHeight;
      
      console.log(`📦 Added product "${product.title}" at Y: ${(currentY - productHeight).toFixed(1)}mm, height: ${productHeight.toFixed(1)}mm`);
    });
  });
  
  // Add service charge at bottom of page
  const serviceY = maxY - 20; // Position service line 20mm from bottom
  addServiceChargeToPdf(
    pdf,
    page.serviceCharge,
    margins.marginLeft,
    serviceY,
    layout,
    contentWidth
  );
  
  console.log(`✅ Page ${page.pageNumber} completed, final Y: ${currentY.toFixed(1)}mm`);
};

// Generate all menu content pages
export const generateAllMenuContentPages = (
  pdf: jsPDF,
  pages: PageContent[],
  layout: PrintLayout
): void => {
  console.log(`📄 Starting generation of ${pages.length} menu content pages`);
  
  pages.forEach((page, index) => {
    console.log(`📄 Generating page ${page.pageNumber} (${index + 1}/${pages.length})`);
    generateMenuContentPage(pdf, page, layout);
  });
  
  console.log(`✅ All ${pages.length} menu content pages generated successfully`);
};
