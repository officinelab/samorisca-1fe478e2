
import { PrintLayout, PageMargins } from '@/types/printLayout';

// Get page margins for different page types
export const getPageMargins = (
  layout: PrintLayout, 
  pageType: 'cover' | 'content' | 'allergens',
  pageNumber?: number
): PageMargins => {
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
