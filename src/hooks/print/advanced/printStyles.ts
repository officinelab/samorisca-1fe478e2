
export const generatePrintStyles = () => {
  return `
    <style>
      @media print {
        @page {
          size: A4;
          margin: 0;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
        }
        
        .print-page {
          page-break-after: always;
          width: 210mm;
          height: 297mm;
          overflow: hidden;
          position: relative;
        }
        
        .print-page:last-child {
          page-break-after: avoid;
        }
        
        /* Mantieni gli stili delle caratteristiche prodotto */
        .product-features-section {
          margin-bottom: 15mm;
        }
        
        .product-features-title {
          display: block !important;
          margin-bottom: 5mm;
        }
        
        .product-features-list {
          display: flex;
          flex-direction: column;
          gap: 3mm;
        }
        
        .product-feature-item {
          display: flex;
          align-items: center;
          gap: 3mm;
        }
        
        .product-feature-icon {
          width: 4mm;
          height: 4mm;
          flex-shrink: 0;
        }
        
        /* Mantieni gli stili degli allergeni - SENZA spacing tra elementi */
        .allergens-section {
          margin-top: 10mm;
        }
        
        .allergens-list {
          display: flex;
          flex-direction: column;
          gap: 0mm;
        }
        
        .allergen-item {
          display: flex;
          align-items: flex-start;
          gap: 3mm;
          margin-bottom: 0mm;
          padding: 2mm;
        }
        
        /* Nascondi elementi UI */
        .print\\:hidden,
        button,
        .border-dashed,
        .absolute.top-3.left-3,
        h3.text-lg.font-semibold {
          display: none !important;
        }
      }
      
      @media screen {
        body {
          margin: 20px;
          background: #f5f5f5;
        }
        
        .print-page {
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          background: white;
        }
      }
    </style>
  `;
};
