
import React from "react";

const PrintStylesheet: React.FC = () => {
  return (
    <style>
      {`
        @media print {
          @page {
            size: A4;
            margin: 0;
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
          
          /* Stile per il supporto corretto alla paginazione */
          .page {
            page-break-after: always;
            break-after: page;
            overflow: visible !important;
            display: block;
            height: auto !important;
            margin: 0 !important;
            box-shadow: none !important;
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

          /* Assicurarsi che tutti i contenuti siano visibili */
          .item-title, .item-description {
            overflow-wrap: break-word;
            word-wrap: break-word;
            hyphens: auto;
            max-width: 100%;
          }
          
          /* Assicurarsi che il contenuto fluisca correttamente tra le pagine */
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
