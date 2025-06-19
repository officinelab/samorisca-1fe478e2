
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

interface MeasurementData {
  categoryTitles: Map<string, number>;
  categoryNotes: Map<string, number>;
  products: Map<string, number>;
  serviceLineHeight: number;
}

export const useMenuPagination = (
  categories: Category[],
  productsByCategory: Record<string, Product[]>,
  categoryNotes: CategoryNote[],
  categoryNotesRelations: Record<string, string[]>,
  serviceCoverCharge: number,
  layout: PrintLayout | null,
  measurements?: MeasurementData | null
) => {
  const heightCalculator = useHeightCalculator(layout, measurements);
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
    return A4_HEIGHT_MM - topMargin - bottomMargin - serviceLineHeight - 3; // 3mm buffer reduced from 5mm
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
      let categoryHeaderAdded = false;

      products.forEach(product => {
        const productHeight = heightCalculator.calculateProductHeight(product);
        const availableHeight = getAvailableHeight(currentPageNumber);
        
        // Calculate required height for this product
        let requiredHeight = productHeight;
        
        // Add spacing between products (except for the first product)
        if (categoryProducts.length > 0) {
          requiredHeight += layout?.spacing.betweenProducts || 0;
        }
        
        // If this is the first product in the category on this page, add category header
        if (!categoryHeaderAdded) {
          requiredHeight += categoryTitleHeight + categoryNotesHeight;
          // Add spacing between categories if there's already content on the page
          if (currentPageContent.length > 0) {
            requiredHeight += layout?.spacing.betweenCategories || 0;
          }
        }

        // Check if this product would exceed the page
        if (currentPageHeight + requiredHeight > availableHeight && currentPageContent.length > 0) {
          // Finish current category section on current page if it has products
          if (categoryProducts.length > 0) {
            currentPageContent.push({
              category,
              notes: categoryHeaderAdded ? [] : relatedNotes, // Notes only if header wasn't added yet
              products: [...categoryProducts],
              isRepeatedTitle: categoryHeaderAdded
            });
            categoryProducts = [];
          }

          // Start new page
          addNewPage();
          categoryHeaderAdded = false; // Reset for new page
        }

        // Add the product to current category
        categoryProducts.push(product);
        
        // Update height calculation
        if (!categoryHeaderAdded) {
          // Add category header height
          currentPageHeight += categoryTitleHeight + categoryNotesHeight;
          // Add spacing between categories if there's already content on the page
          if (currentPageContent.length > 0) {
            currentPageHeight += layout?.spacing.betweenCategories || 0;
          }
          categoryHeaderAdded = true;
        }
        
        // Add product height
        currentPageHeight += productHeight;
        
        // Add spacing between products (except for the first product in category)
        if (categoryProducts.length > 1) {
          currentPageHeight += layout?.spacing.betweenProducts || 0;
        }
      });

      // Add remaining products for this category
      if (categoryProducts.length > 0) {
        currentPageContent.push({
          category,
          notes: categoryHeaderAdded ? [] : relatedNotes, // Notes only if this is the first appearance of category
          products: categoryProducts,
          isRepeatedTitle: categoryHeaderAdded && currentPageContent.some(c => c.category.id === category.id)
        });
      }
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
