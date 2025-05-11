
import { PrintLayout } from "@/types/printLayout";
import React from "react";

/**
 * Generate CSS styles based on the layout configuration
 */
export const getElementStyle = (config: PrintLayout['elements']['category']) => {
  return {
    fontFamily: config.fontFamily,
    fontSize: `${config.fontSize}pt`,
    color: config.fontColor,
    fontWeight: config.fontStyle === 'bold' ? 'bold' : 'normal',
    fontStyle: config.fontStyle === 'italic' ? 'italic' : 'normal',
    textAlign: config.alignment,
    marginTop: `${config.margin.top}mm`,
    marginRight: `${config.margin.right}mm`,
    marginBottom: `${config.margin.bottom}mm`,
    marginLeft: `${config.margin.left}mm`,
  } as React.CSSProperties;
};

/**
 * Get page margins based on page index and layout configuration
 */
export const getPageMargins = (layout: PrintLayout, pageIndex: number) => {
  // Use general margins unless distinct margins are enabled
  if (!layout.page.useDistinctMarginsForPages) {
    return {
      marginTop: `${layout.page.marginTop}mm`,
      marginRight: `${layout.page.marginRight}mm`,
      marginBottom: `${layout.page.marginBottom}mm`,
      marginLeft: `${layout.page.marginLeft}mm`,
    };
  }
  
  // Pagina dispari (1, 3, 5, ...)
  if (pageIndex % 2 === 0) {
    return {
      marginTop: `${layout.page.oddPages.marginTop}mm`,
      marginRight: `${layout.page.oddPages.marginRight}mm`,
      marginBottom: `${layout.page.oddPages.marginBottom}mm`,
      marginLeft: `${layout.page.oddPages.marginLeft}mm`,
    };
  }
  // Pagina pari (2, 4, 6, ...)
  else {
    return {
      marginTop: `${layout.page.evenPages.marginTop}mm`,
      marginRight: `${layout.page.evenPages.marginRight}mm`,
      marginBottom: `${layout.page.evenPages.marginBottom}mm`,
      marginLeft: `${layout.page.evenPages.marginLeft}mm`,
    };
  }
};
