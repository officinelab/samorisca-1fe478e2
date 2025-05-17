import React from "react";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import { PRINT_CONSTANTS } from "@/hooks/menu-layouts/constants";

const PrintStylesheet: React.FC = () => {
  const { layouts, activeLayout } = useMenuLayouts();
  const layout = activeLayout || (layouts && layouts[0]);

  const fallback = PRINT_CONSTANTS.DEFAULT_MARGINS;
  let marginTop = fallback.TOP,
    marginRight = fallback.RIGHT,
    marginBottom = fallback.BOTTOM,
    marginLeft = fallback.LEFT;
  let oddTop = fallback.TOP,
    oddRight = fallback.RIGHT,
    oddBottom = fallback.BOTTOM,
    oddLeft = fallback.LEFT;
  let evenTop = fallback.TOP,
    evenRight = fallback.RIGHT,
    evenBottom = fallback.BOTTOM,
    evenLeft = fallback.LEFT;

  if (layout && layout.page) {
    marginTop = layout.page.marginTop ?? fallback.TOP;
    marginRight = layout.page.marginRight ?? fallback.RIGHT;
    marginBottom = layout.page.marginBottom ?? fallback.BOTTOM;
    marginLeft = layout.page.marginLeft ?? fallback.LEFT;

    if (layout.page.useDistinctMarginsForPages) {
      oddTop = layout.page.oddPages?.marginTop ?? marginTop;
      oddRight = layout.page.oddPages?.marginRight ?? marginRight;
      oddBottom = layout.page.oddPages?.marginBottom ?? marginBottom;
      oddLeft = layout.page.oddPages?.marginLeft ?? marginLeft;
      evenTop = layout.page.evenPages?.marginTop ?? marginTop;
      evenRight = layout.page.evenPages?.marginRight ?? marginRight;
      evenBottom = layout.page.evenPages?.marginBottom ?? marginBottom;
      evenLeft = layout.page.evenPages?.marginLeft ?? marginLeft;
    } else {
      oddTop = evenTop = marginTop;
      oddRight = evenRight = marginRight;
      oddBottom = evenBottom = marginBottom;
      oddLeft = evenLeft = marginLeft;
    }
  }

  // STEP 2: CSS PRINT aggiornato per margini coerenti JS <-> CSS
  return (
    <style>
      {`
        @media print {
          @page {
            size: A4;
          }
          @page :right {
            margin: ${oddTop}mm ${oddRight}mm ${oddBottom}mm ${oddLeft}mm;
          }
          @page :left {
            margin: ${evenTop}mm ${evenRight}mm ${evenBottom}mm ${evenLeft}mm;
          }
          * {
            box-sizing: border-box !important;
          }
          .product-item, .category-block, .category, .menu-item, .category-products, .category-title {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .page {
            page-break-after: always;
            break-after: page;
            overflow: visible !important;
            display: block;
            height: auto !important;
            background: white;
          }
          .page:last-of-type {
            page-break-after: avoid;
            break-after: avoid;
          }
          .category, .category-block {
            break-inside: avoid;
            page-break-inside: avoid;
            overflow: visible !important;
          }
          .menu-item, .product-item {
            break-inside: avoid;
            page-break-inside: avoid;
            overflow: visible !important;
          }
          .allergen-item {
            break-inside: avoid;
          }
          .item-title, .item-description {
            overflow-wrap: break-word;
            word-wrap: break-word;
            hyphens: auto;
            max-width: 100%;
          }
          .menu-container {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
          }
        }
        * {
          box-sizing: border-box !important;
        }
      `}
    </style>
  );
};

export default PrintStylesheet;
