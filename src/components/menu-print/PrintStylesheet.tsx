
import React from "react";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import { PRINT_CONSTANTS } from "@/hooks/menu-layouts/constants";

/**
 * Usa i margini del layout attivo per il CSS print dinamico.
 */
const PrintStylesheet: React.FC = () => {
  const { layouts, activeLayout } = useMenuLayouts();
  const layout = activeLayout || (layouts && layouts[0]);

  // Fallback ai margini costanti
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

    // Applico margini dispari/pario solo se previsti
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

  // CSS paged media print con :right (dispari) e :left (pari)
  return (
    <style>
      {`
        @media print {
          @page {
            size: A4;
          }
          /* Pagine dispari (destra) */
          @page :right {
            margin: ${oddTop}mm ${oddRight}mm ${oddBottom}mm ${oddLeft}mm;
          }
          /* Pagine pari (sinistra) */
          @page :left {
            margin: ${evenTop}mm ${evenRight}mm ${evenBottom}mm ${evenLeft}mm;
          }
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
          }
          body * {
            visibility: hidden;
          }
          #print-content, #print-content * {
            visibility: visible;
          }
          .print\\:p-0, .print\\:p-0 * {
            visibility: visible;
          }
          .print\\:p-0 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print-hidden {
            display: none !important;
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
          .category {
            break-inside: avoid;
            page-break-inside: avoid;
            overflow: visible !important;
          }
          .menu-item {
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
      `}
    </style>
  );
};

export default PrintStylesheet;
