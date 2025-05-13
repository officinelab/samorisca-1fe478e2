
import { PrintLayout, PageMargins } from "@/types/printLayout";

/**
 * Ensure that all page margins are valid and synchronized when needed
 */
export const syncPageMargins = (layout: PrintLayout): PrintLayout => {
  // If there's no layout or page settings, return the layout as is
  if (!layout || !layout.page) return layout;
  
  const { useDistinctMarginsForPages, marginTop, marginRight, marginBottom, marginLeft, oddPages, evenPages } = layout.page;
  
  // If not using distinct margins, make sure all margins are synchronized
  if (!useDistinctMarginsForPages) {
    return {
      ...layout,
      page: {
        ...layout.page,
        // Use main margins for odd and even pages
        oddPages: {
          marginTop,
          marginRight,
          marginBottom,
          marginLeft
        },
        evenPages: {
          marginTop,
          marginRight,
          marginBottom,
          marginLeft
        }
      }
    };
  }
  
  // If using distinct margins, make sure oddPages and evenPages are defined
  const safeOddPages: PageMargins = oddPages || {
    marginTop,
    marginRight,
    marginBottom,
    marginLeft
  };
  
  const safeEvenPages: PageMargins = evenPages || {
    marginTop,
    marginRight,
    marginBottom,
    marginLeft
  };
  
  return {
    ...layout,
    page: {
      ...layout.page,
      oddPages: safeOddPages,
      evenPages: safeEvenPages
    }
  };
};

/**
 * Fix any invalid margins in the layout
 */
export const ensureValidMargins = (layout: PrintLayout): PrintLayout => {
  // Ensure all margins have valid values (non-negative)
  const fixMargin = (value: any) => {
    const num = Number(value);
    return isNaN(num) ? 0 : Math.max(0, num);
  };
  
  const fixedLayout = { ...layout };
  
  // Fix main margins
  if (fixedLayout.page) {
    fixedLayout.page.marginTop = fixMargin(fixedLayout.page.marginTop);
    fixedLayout.page.marginRight = fixMargin(fixedLayout.page.marginRight);
    fixedLayout.page.marginBottom = fixMargin(fixedLayout.page.marginBottom);
    fixedLayout.page.marginLeft = fixMargin(fixedLayout.page.marginLeft);
    
    // Fix odd pages margins
    if (fixedLayout.page.oddPages) {
      fixedLayout.page.oddPages.marginTop = fixMargin(fixedLayout.page.oddPages.marginTop);
      fixedLayout.page.oddPages.marginRight = fixMargin(fixedLayout.page.oddPages.marginRight);
      fixedLayout.page.oddPages.marginBottom = fixMargin(fixedLayout.page.oddPages.marginBottom);
      fixedLayout.page.oddPages.marginLeft = fixMargin(fixedLayout.page.oddPages.marginLeft);
    }
    
    // Fix even pages margins
    if (fixedLayout.page.evenPages) {
      fixedLayout.page.evenPages.marginTop = fixMargin(fixedLayout.page.evenPages.marginTop);
      fixedLayout.page.evenPages.marginRight = fixMargin(fixedLayout.page.evenPages.marginRight);
      fixedLayout.page.evenPages.marginBottom = fixMargin(fixedLayout.page.evenPages.marginBottom);
      fixedLayout.page.evenPages.marginLeft = fixMargin(fixedLayout.page.evenPages.marginLeft);
    }
  }
  
  return fixedLayout;
};
