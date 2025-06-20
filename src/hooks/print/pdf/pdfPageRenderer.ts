
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { addCategoryToPdf, addCategoryNotesToPdf, addProductToPdf, addServiceChargeToPdf } from './renderers/menuContentRenderer';

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

// Generate a single menu content page in PDF with proper layout matching preview
export const generateMenuContentPage = async (
  pdf: jsPDF,
  page: PageContent,
  layout: PrintLayout
): Promise<void> => {
  console.log(`📄 Generating PDF page ${page.pageNumber} with ${page.categories.length} category sections`);
  
  // Add new page if this is not the first page being added
  if (page.pageNumber > 1) {
    pdf.addPage();
  }
  
  const margins = getPageMargins(layout, 'content', page.pageNumber);
  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const contentWidth = pageWidth - margins.marginLeft - margins.marginRight;
  
  let currentY = margins.marginTop;
  const maxY = pageHeight - margins.marginBottom - 20; // Reserve space for service charge
  
  console.log(`📐 Page ${page.pageNumber} margins:`, margins);
  console.log(`📐 Content width: ${contentWidth}mm, starting Y: ${currentY}mm, max Y: ${maxY}mm`);
  
  // Log page breaks information if present
  if (layout.pageBreaks?.categoryIds?.length > 0) {
    console.log(`🔗 Page breaks configured for categories:`, layout.pageBreaks.categoryIds);
    
    // Check if this page starts due to a page break
    const categoriesInPage = page.categories.map(cs => cs.category.id);
    const hasPageBreakCategories = categoriesInPage.some(id => layout.pageBreaks.categoryIds.includes(id));
    
    if (hasPageBreakCategories) {
      console.log(`📄 Page ${page.pageNumber} contains categories with page breaks configured`);
    }
  }
  
  // Render each category section exactly like preview
  for (const categorySection of page.categories) {
    // Category title and notes (only if not repeated)
    if (!categorySection.isRepeatedTitle) {
      // Add spacing between categories if not the first section
      if (page.categories.indexOf(categorySection) > 0) {
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
      
      // Category notes - await the async function properly
      if (categorySection.notes.length > 0) {
        const notesHeight = await addCategoryNotesToPdf(
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
    
    // Render products with proper two-column layout
    for (const product of categorySection.products) {
      const isLastProduct = categorySection.products.indexOf(product) === categorySection.products.length - 1;
      
      const productHeight = await addProductToPdf(
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
    }
  }
  
  // Add service charge at bottom of page with proper positioning - include pageNumber argument
  const serviceY = maxY;
  addServiceChargeToPdf(
    pdf,
    page.serviceCharge,
    margins.marginLeft,
    serviceY,
    layout,
    contentWidth,
    page.pageNumber
  );
  
  console.log(`✅ Page ${page.pageNumber} completed, final Y: ${currentY.toFixed(1)}mm, service at: ${serviceY.toFixed(1)}mm`);
};

// Generate all menu content pages with async support
export const generateAllMenuContentPages = async (
  pdf: jsPDF,
  pages: PageContent[],
  layout: PrintLayout
): Promise<void> => {
  console.log(`📄 Starting generation of ${pages.length} menu content pages`);
  
  // Log page breaks summary
  if (layout.pageBreaks?.categoryIds?.length > 0) {
    console.log(`🔗 Page breaks will be applied for ${layout.pageBreaks.categoryIds.length} categories`);
  }
  
  for (const page of pages) {
    console.log(`📄 Generating page ${page.pageNumber} (${pages.indexOf(page) + 1}/${pages.length})`);
    await generateMenuContentPage(pdf, page, layout);
  }
  
  console.log(`✅ All ${pages.length} menu content pages generated successfully with page breaks support`);
};
