
import React from 'react';

/**
 * Componente che aggiunge stili dedicati alla stampa,
 * per garantire una corretta visualizzazione del menu quando stampato
 */
const PrintStylesheet = () => {
  return (
    <style jsx global>{`
      /* Reset per tutti i margini e padding di default */
      @page {
        size: A4;
        margin: 0;
        padding: 0;
      }

      /* Stili per la stampa */
      @media print {
        body, html {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          background-color: white;
        }

        .page {
          overflow: hidden !important; /* Nasconde il contenuto che esce dai confini */
          page-break-after: always !important;
          break-after: page !important;
          display: block;
          background-color: white;
          box-shadow: none !important;
          position: relative;
        }

        .menu-container {
          overflow: hidden !important; /* Nasconde il contenuto che esce dai confini */
          background-color: white;
        }

        /* Non spezzare a metà titolo o singolo prodotto */
        .category-title,
        .repeated-category-title,
        .menu-item,
        .product-item {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* Nascondi gli elementi che non servono in stampa */
        button, .print:hidden, .print-hidden,
        nav, header, .header, .navbar,
        .print-actions, .page-controls,
        .scroll-area-scrollbar, .actions-bar {
          display: none !important;
        }
        
        /* Rimuove lo scrollbar */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        
        /* Altri stili di stampa */
        a {
          text-decoration: none;
          color: inherit;
        }
      }
    `}</style>
  );
};

export default PrintStylesheet;
