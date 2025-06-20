
import { PrintLayout } from '@/types/printLayout';
import { Product, Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { useOptimizedPreRenderMeasurement } from '../print/useOptimizedPreRenderMeasurement';

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

export const useOptimizedMenuPagination = (
  categories: Category[],
  productsByCategory: Record<string, Product[]>,
  categoryNotes: CategoryNote[],
  categoryNotesRelations: Record<string, string[]>,
  serviceCoverCharge: number,
  layout: PrintLayout | null
) => {
  const A4_HEIGHT_MM = 297;
  const SAFETY_MARGIN_MM = 5; // Reduced from 8mm

  // Use optimized measurement system
  const { measurements, isLoading } = useOptimizedPreRenderMeasurement(
    layout,
    categories,
    productsByCategory,
    categoryNotes,
    categoryNotesRelations,
    serviceCoverCharge
  );

  const getAvailableHeight = (pageNumber: number): number => {
    if (!layout) return 250;

    const margins = layout.page;
    let topMargin = margins.marginTop;
    let bottomMargin = margins.marginBottom;

    if (margins.useDistinctMarginsForPages && pageNumber > 1) {
      if (pageNumber % 2 === 1) {
        topMargin = margins.oddPages.marginTop;
        bottomMargin = margins.oddPages.marginBottom;
      } else {
        topMargin = margins.evenPages.marginTop;
        bottomMargin = margins.evenPages.marginBottom;
      }
    }

    const serviceLineHeight = measurements?.serviceLineHeight || 20;
    const totalHeight = A4_HEIGHT_MM - topMargin - bottomMargin - serviceLineHeight - SAFETY_MARGIN_MM;
    
    return totalHeight;
  };

  const createPages = (): PageContent[] => {
    if (!measurements || isLoading) {
      return [];
    }

    const pages: PageContent[] = [];
    let currentPageNumber = 3;
    let currentPageHeight = 0;
    let currentPageContent: PageContent['categories'] = [];

    const pageBreakCategoryIds = layout?.pageBreaks?.categoryIds || [];

    const addNewPage = () => {
      if (currentPageContent.length > 0) {
        pages.push({
          pageNumber: currentPageNumber,
          categories: [...currentPageContent],
          serviceCharge: serviceCoverCharge
        });
        console.log('📄 Page ' + currentPageNumber + ' created with ' + currentPageContent.length + ' categories, height: ' + currentPageHeight.toFixed(2) + 'mm');
        currentPageNumber++;
        currentPageContent = [];
        currentPageHeight = 0;
      }
    };

    const forcePageBreak = (categoryTitle: string) => {
      console.log('🔥 FORCED page break after category: ' + categoryTitle);
      addNewPage();
    };

    categories.forEach((category, categoryIndex) => {
      const categoryTitleHeight = measurements.categoryHeights.get(category.id) || 40;
      const relatedNoteIds = categoryNotesRelations[category.id] || [];
      const relatedNotes = categoryNotes.filter(note => relatedNoteIds.includes(note.id));
      
      const products = productsByCategory[category.id] || [];
      let remainingProducts = [...products];
      let categoryHeaderAddedOnCurrentPage = false;

      while (remainingProducts.length > 0) {
        let currentCategoryProducts: Product[] = [];
        let tempHeight = currentPageHeight;

        if (!categoryHeaderAddedOnCurrentPage) {
          let categoryHeaderHeight = categoryTitleHeight;
          
          if (currentPageContent.length > 0) {
            categoryHeaderHeight += layout?.spacing.betweenCategories || 12;
          }

          const availableHeight = getAvailableHeight(currentPageNumber);
          if (tempHeight + categoryHeaderHeight > availableHeight && currentPageContent.length > 0) {
            addNewPage();
            tempHeight = 0;
          }

          tempHeight += categoryHeaderHeight;
          categoryHeaderAddedOnCurrentPage = true;
        }

        // Add products efficiently
        for (let i = 0; i < remainingProducts.length; i++) {
          const product = remainingProducts[i];
          const productHeight = measurements.productHeights.get(product.id) || 45;
          let requiredHeight = productHeight;

          if (currentCategoryProducts.length > 0) {
            requiredHeight += layout?.spacing.betweenProducts || 4;
          }

          const availableHeight = getAvailableHeight(currentPageNumber);
          const safeRequiredHeight = requiredHeight * 1.02; // Reduced safety buffer
          
          if (tempHeight + safeRequiredHeight <= availableHeight) {
            currentCategoryProducts.push(product);
            tempHeight += requiredHeight;
          } else {
            break;
          }
        }

        if (currentCategoryProducts.length === 0 && remainingProducts.length > 0) {
          currentCategoryProducts.push(remainingProducts[0]);
          const forcedProductHeight = measurements.productHeights.get(remainingProducts[0].id) || 45;
          tempHeight += forcedProductHeight;
        }

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
        }

        if (remainingProducts.length > 0) {
          addNewPage();
          categoryHeaderAddedOnCurrentPage = false;
        }
      }

      // Check for forced page breaks
      const shouldForcePageBreak = pageBreakCategoryIds.includes(category.id);
      const isLastCategory = categoryIndex === categories.length - 1;
      
      if (shouldForcePageBreak && !isLastCategory) {
        forcePageBreak(category.title);
      }
    });

    addNewPage();

    console.log('✅ OPTIMIZED pagination completed: ' + pages.length + ' pages generated');
    return pages;
  };

  return {
    createPages,
    getAvailableHeight,
    isLoadingMeasurements: isLoading,
    measurements
  };
};
