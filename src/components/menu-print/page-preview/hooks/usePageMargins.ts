
import { PrintLayout } from '@/types/printLayout';

export const usePageMargins = (layout: PrintLayout, pageNumber: number) => {
  const getPageMargins = () => {
    const margins = layout.page;
    let topMargin = margins.marginTop;
    let rightMargin = margins.marginRight;
    let bottomMargin = margins.marginBottom;
    let leftMargin = margins.marginLeft;

    // Check if using distinct margins for odd/even pages
    if (margins.useDistinctMarginsForPages && pageNumber > 1) {
      if (pageNumber % 2 === 1) { // Odd page
        topMargin = margins.oddPages.marginTop;
        rightMargin = margins.oddPages.marginRight;
        bottomMargin = margins.oddPages.marginBottom;
        leftMargin = margins.oddPages.marginLeft;
      } else { // Even page
        topMargin = margins.evenPages.marginTop;
        rightMargin = margins.evenPages.marginRight;
        bottomMargin = margins.evenPages.marginBottom;
        leftMargin = margins.evenPages.marginLeft;
      }
    }

    return { topMargin, rightMargin, bottomMargin, leftMargin };
  };

  return getPageMargins();
};
