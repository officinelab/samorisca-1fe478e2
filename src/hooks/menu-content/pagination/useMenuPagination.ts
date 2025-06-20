
import { PrintLayout } from '@/types/printLayout';
import { Product, Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { usePreRenderMeasurement } from '../../print/usePreRenderMeasurement';
import { usePageHeightCalculator } from './usePageHeightCalculator';
import { usePageBreakHandler } from './usePageBreakHandler';
import { usePageContentBuilder } from './usePageContentBuilder';
import { PageContent } from './types';

export const useMenuPagination = (
  categories: Category[],
  productsByCategory: Record<string, Product[]>,
  categoryNotes: CategoryNote[],
  categoryNotesRelations: Record<string, string[]>,
  serviceCoverCharge: number,
  layout: PrintLayout | null
) => {
  // Use the pre-render system to get real measurements
  const { measurements, isLoading } = usePreRenderMeasurement(
    layout,
    categories,
    productsByCategory,
    categoryNotes,
    categoryNotesRelations,
    serviceCoverCharge
  );

  const { getAvailableHeight } = usePageHeightCalculator(layout);
  const { shouldForcePageBreak, logPageBreakConfiguration, forcePageBreak } = usePageBreakHandler(layout);
  const { addProductsToPage, createPageContent } = usePageContentBuilder(
    measurements,
    layout,
    getAvailableHeight
  );

  const createPages = (): PageContent[] => {
    if (!measurements || isLoading) {
      return [];
    }

    const pages: PageContent[] = [];
    let currentPageNumber = 3; // Starting after cover pages
    let currentPageHeight = 0;
    let currentPageContent: PageContent['categories'] = [];

    // Get configured page breaks
    logPageBreakConfiguration();

    const addNewPage = () => {
      if (currentPageContent.length > 0) {
        pages.push(createPageContent(currentPageNumber, currentPageContent, serviceCoverCharge));
        console.log('📄 Creata pagina ' + currentPageNumber + ' con ' + currentPageContent.length + ' categorie, altezza totale: ' + currentPageHeight.toFixed(2) + 'mm');
        currentPageNumber++;
        currentPageContent = [];
        currentPageHeight = 0;
      }
    };

    const forcePageBreakHandler = (categoryTitle: string) => {
      forcePageBreak(categoryTitle, currentPageContent, addNewPage);
    };

    categories.forEach((category, categoryIndex) => {
      const categoryTitleHeight = measurements.categoryHeights.get(category.id) || 40;
      const relatedNoteIds = categoryNotesRelations[category.id] || [];
      const relatedNotes = categoryNotes.filter(note => relatedNoteIds.includes(note.id));
      
      const totalCategoryHeaderHeight = categoryTitleHeight;
      const products = productsByCategory[category.id] || [];
      let remainingProducts = [...products];
      let categoryHeaderAddedOnCurrentPage = false;

      console.log('📊 Categoria "' + category.title + '": ' + products.length + ' prodotti, altezza header: ' + totalCategoryHeaderHeight.toFixed(2) + 'mm');

      // Continue until there are remaining products to process
      while (remainingProducts.length > 0) {
        let currentCategoryProducts: Product[] = [];
        let tempHeight = currentPageHeight;

        // If we haven't added the category header to this page yet
        if (!categoryHeaderAddedOnCurrentPage) {
          let categoryHeaderHeight = totalCategoryHeaderHeight;
          
          // Add spacing between categories if there's already content on the page
          if (currentPageContent.length > 0) {
            categoryHeaderHeight += layout?.spacing.betweenCategories || 12;
          }

          // Check if the category header can fit on this page
          const availableHeight = getAvailableHeight(currentPageNumber);
          if (tempHeight + categoryHeaderHeight > availableHeight && currentPageContent.length > 0) {
            console.log('⚠️ Header categoria non entra (' + tempHeight.toFixed(2) + ' + ' + categoryHeaderHeight.toFixed(2) + ' > ' + availableHeight.toFixed(2) + '), nuova pagina');
            addNewPage();
            tempHeight = 0;
          }

          tempHeight += categoryHeaderHeight;
          categoryHeaderAddedOnCurrentPage = true;
        }

        // Try to add as many products as possible to this page
        const { addedProducts, newHeight } = addProductsToPage(
          remainingProducts,
          tempHeight,
          currentPageNumber,
          currentCategoryProducts
        );
        
        currentCategoryProducts = addedProducts;
        tempHeight = newHeight;

        // If we couldn't add even one product, force adding the first one
        if (currentCategoryProducts.length === 0 && remainingProducts.length > 0) {
          currentCategoryProducts.push(remainingProducts[0]);
          const forcedProductHeight = measurements.productHeights.get(remainingProducts[0].id) || 45;
          tempHeight += forcedProductHeight;
          console.warn('⚠️ Prodotto "' + remainingProducts[0].title + '" troppo alto per la pagina, forzato comunque (altezza: ' + forcedProductHeight.toFixed(2) + 'mm)');
        }

        // Add the category section to the current page
        if (currentCategoryProducts.length > 0) {
          const isRepeatedTitle = currentPageContent.some(c => c.category.id === category.id);
          
          currentPageContent.push({
            category,
            notes: !isRepeatedTitle ? relatedNotes : [],
            products: [...currentCategoryProducts],
            isRepeatedTitle
          });

          currentPageHeight = tempHeight;
          remainingProducts = remainingProducts.slice(currentCategoryProducts.length);
          
          console.log('✅ Aggiunti ' + currentCategoryProducts.length + ' prodotti, rimanenti: ' + remainingProducts.length + ', altezza pagina: ' + currentPageHeight.toFixed(2) + 'mm');
        }

        // If there are still remaining products, they'll need to go to a new page
        if (remainingProducts.length > 0) {
          console.log('📄 Prodotti rimanenti richiedono nuova pagina');
          addNewPage();
          categoryHeaderAddedOnCurrentPage = false;
        }
      }

      // Check for forced page break after this category
      const shouldBreak = shouldForcePageBreak(category.id);
      const isLastCategory = categoryIndex === categories.length - 1;
      
      if (shouldBreak && !isLastCategory) {
        console.log('🔥 Interruzione di pagina configurata per categoria: ' + category.title);
        forcePageBreakHandler(category.title);
      }
    });

    // Add the last page if it contains content
    addNewPage();

    console.log('✅ Paginazione completata: ' + pages.length + ' pagine generate');
    pages.forEach((page, index) => {
      const totalProducts = page.categories.reduce((sum, cat) => sum + cat.products.length, 0);
      const totalCategories = page.categories.length;
      const uniqueCategories = new Set(page.categories.map(c => c.category.id)).size;
      console.log('📄 Pagina ' + page.pageNumber + ': ' + totalCategories + ' sezioni (' + uniqueCategories + ' categorie uniche), ' + totalProducts + ' prodotti totali');
    });

    return pages;
  };

  return {
    createPages,
    getAvailableHeight,
    isLoadingMeasurements: isLoading,
    measurements
  };
};
