
import React from "react";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";

/**
 * Usa i margini del layout attivo per il CSS print dinamico.
 */
const PrintStylesheet: React.FC = () => {
  const { layouts, activeLayout } = useMenuLayouts();
  // Scegli il layout attivo o uno qualunque come fallback
  const layout = activeLayout || (layouts && layouts[0]);
  // Estrarre i margini
  let marginTop = 20, marginRight = 15, marginBottom = 20, marginLeft = 15;
  if (layout && layout.page) {
    marginTop = layout.page.marginTop || 20;
    marginRight = layout.page.marginRight || 15;
    marginBottom = layout.page.marginBottom || 20;
    marginLeft = layout.page.marginLeft || 15;
  }

  return (
    <style>
      {`
        @media print {
          @page {
            size: A4;
            margin: ${marginTop}mm ${marginRight}mm ${marginBottom}mm ${marginLeft}mm;
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
          /* Supporto paginazione */
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
