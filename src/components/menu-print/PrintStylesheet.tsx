
import React from "react";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";

/**
 * Applica i margini utente dal layout dinamico direttamente in @page nel CSS print.
 */
const PrintStylesheet: React.FC = () => {
  const { activeLayout } = useMenuLayouts();

  // Helper per generare il CSS @page basato sul layout
  const getPageCSS = () => {
    if (!activeLayout) {
      return `
        @page {
          size: A4;
          margin: 0;
        }
      `;
    }

    // CSS per margini normali o distinti
    if (!activeLayout.page.useDistinctMarginsForPages) {
      return `
        @page {
          size: A4;
          margin: ${activeLayout.page.marginTop}mm ${activeLayout.page.marginRight}mm ${activeLayout.page.marginBottom}mm ${activeLayout.page.marginLeft}mm;
        }
      `;
    } else {
      // Non esiste un vero modo per @page:odd/@page:even cross-browser, ma diamo supporto moderno (Chrome)
      return `
        @page {
          size: A4;
          margin: ${activeLayout.page.marginTop}mm ${activeLayout.page.marginRight}mm ${activeLayout.page.marginBottom}mm ${activeLayout.page.marginLeft}mm;
        }
        @page:left {
          margin: ${activeLayout.page.evenPages.marginTop}mm ${activeLayout.page.evenPages.marginRight}mm ${activeLayout.page.evenPages.marginBottom}mm ${activeLayout.page.evenPages.marginLeft}mm;
        }
        @page:right {
          margin: ${activeLayout.page.oddPages.marginTop}mm ${activeLayout.page.oddPages.marginRight}mm ${activeLayout.page.oddPages.marginBottom}mm ${activeLayout.page.oddPages.marginLeft}mm;
        }
      `;
    }
  };

  return (
    <style>
      {`
        ${getPageCSS()}
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
        
        /* Stile per il supporto corretto alla paginazione */
        .page {
          page-break-after: always;
          break-after: page;
          overflow: visible !important;
          display: block;
          height: auto !important;
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
      `}
    </style>
  );
};

export default PrintStylesheet;
