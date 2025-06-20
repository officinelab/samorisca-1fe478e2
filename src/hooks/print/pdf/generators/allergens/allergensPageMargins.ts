
import { PrintLayout } from '@/types/printLayout';

// Get page margins for allergens page
export const getAllergensPageMargins = (layout: PrintLayout, pageNumber: number) => {
  if (layout.page.useDistinctMarginsForAllergensPages && pageNumber) {
    const isOddPage = pageNumber % 2 === 1;
    if (isOddPage && layout.page.allergensOddPages) {
      return layout.page.allergensOddPages;
    } else if (!isOddPage && layout.page.allergensEvenPages) {
      return layout.page.allergensEvenPages;
    }
  }
  return {
    marginTop: layout.page.allergensMarginTop,
    marginRight: layout.page.allergensMarginRight,
    marginBottom: layout.page.allergensMarginBottom,
    marginLeft: layout.page.allergensMarginLeft
  };
};
