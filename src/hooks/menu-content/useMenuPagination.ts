
import { PrintLayout } from '@/types/printLayout';
import { Product, Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { useHeightCalculator } from './useHeightCalculator';

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

export const useMenuPagination = (
  categories: Category[],
  productsByCategory: Record<string, Product[]>,
  categoryNotes: CategoryNote[],
  categoryNotesRelations: Record<string, string[]>,
  serviceCoverCharge: number,
  layout: PrintLayout | null
) => {
  const heightCalculator = useHeightCalculator(layout);
  const A4_HEIGHT_MM = 297;

  const getAvailableHeight = (pageNumber: number): number => {
    if (!layout) return 250; // Default available height

    const margins = layout.page;
    let topMargin = margins.marginTop;
    let bottomMargin = margins.marginBottom;

    // Check if using distinct margins for odd/even pages
    if (margins.useDistinctMarginsForPages && pageNumber > 1) {
      if (pageNumber % 2 === 1) { // Odd page
        topMargin = margins.oddPages.marginTop;
        bottomMargin = margins.oddPages.marginBottom;
      } else { // Even page
        topMargin = margins.evenPages.marginTop;
        bottomMargin = margins.evenPages.marginBottom;
      }
    }

    const serviceLineHeight = heightCalculator.calculateServiceLineHeight();
    return A4_HEIGHT_MM - topMargin - bottomMargin - serviceLineHeight - 10; // 10mm buffer
  };

  const createPages = (): PageContent[] => {
    const pages: PageContent[] = [];
    let currentPageNumber = 3; // Starting after cover pages
    let currentPageHeight = 0;
    let currentPageContent: PageContent['categories'] = [];

    const addNewPage = () => {
      if (currentPageContent.length > 0) {
        pages.push({
          pageNumber: currentPageNumber,
          categories: [...currentPageContent],
          serviceCharge: serviceCoverCharge
        });
        currentPageNumber++;
        currentPageContent = [];
        currentPageHeight = 0;
      }
    };

    categories.forEach(category => {
      const categoryTitleHeight = heightCalculator.calculateCategoryTitleHeight(category);
      const relatedNoteIds = categoryNotesRelations[category.id] || [];
      const relatedNotes = categoryNotes.filter(note => relatedNoteIds.includes(note.id));
      const categoryNotesHeight = relatedNotes.reduce((sum, note) => 
        sum + heightCalculator.calculateCategoryNoteHeight(note), 0
      );

      const products = productsByCategory[category.id] || [];
      let categoryProducts: Product[] = [];
      let isFirstProductInCategory = true;

      products.forEach(product => {
        const productHeight = heightCalculator.calculateProductHeight(product);
        const availableHeight = getAvailableHeight(currentPageNumber);

        // Check if we need to add category title + notes (for first product or repeated title)
        let requiredHeight = productHeight + layout?.spacing.betweenProducts || 0;
        
        if (isFirstProductInCategory || categoryProducts.length === 0) {
          requiredHeight += categoryTitleHeight + categoryNotesHeight;
        }

        // If this would exceed the page, start a new page
        if (currentPageHeight + requiredHeight > availableHeight && currentPageContent.length > 0) {
          // Finish current category on current page if it has products
          if (categoryProducts.length > 0) {
            currentPageContent.push({
              category,
              notes: isFirstProductInCategory ? relatedNotes : [],
              products: [...categoryProducts],
              isRepeatedTitle: !isFirstProductInCategory
            });
            categoryProducts = [];
          }

          addNewPage();
          isFirstProductInCategory = false; // Will be repeated title on new page
        }

        // Add the product to current category
        categoryProducts.push(product);
        
        // Update height calculation
        if (isFirstProductInCategory) {
          currentPageHeight += categoryTitleHeight + categoryNotesHeight;
          isFirstProductInCategory = false;
        }
        currentPageHeight += productHeight + (layout?.spacing.betweenProducts || 0);
      });

      // Add remaining products for this category
      if (categoryProducts.length > 0) {
        currentPageContent.push({
          category,
          notes: currentPageContent.length === 0 ? relatedNotes : [], // Only add notes if first category on page
          products: categoryProducts,
          isRepeatedTitle: false
        });
      }

      // Add spacing between categories
      currentPageHeight += layout?.spacing.betweenCategories || 0;
    });

    // Add the last page if it has content
    addNewPage();

    return pages;
  };

  return {
    createPages,
    getAvailableHeight
  };
};
