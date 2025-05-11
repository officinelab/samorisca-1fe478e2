
/**
 * CSS styles to be applied to the print window
 */
export const getPrintStyles = (): string => {
  return `
    @page {
      size: A4;
      margin: 0;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Arial', sans-serif;
      background-color: white;
      width: 100%;
      height: 100%;
    }
    
    * {
      box-sizing: border-box;
    }
    
    .page {
      width: 210mm;
      height: 297mm;
      padding: 20mm 15mm;
      box-sizing: border-box;
      page-break-after: always;
      break-after: page;
      position: relative;
      overflow: visible;
    }
    
    .page:last-of-type {
      page-break-after: avoid;
      break-after: avoid;
    }
    
    .menu-container {
      margin: 0 auto;
      max-width: 100%;
      overflow: visible;
      height: auto !important;
      max-height: none !important;
    }
    
    .category {
      margin-bottom: 15mm;
      break-inside: avoid;
      page-break-inside: avoid;
      overflow: visible;
    }
    
    .category-title {
      font-size: 18pt;
      font-weight: bold;
      margin-bottom: 5mm;
      text-transform: uppercase;
      border-bottom: 1px solid #000;
      padding-bottom: 2mm;
    }
    
    .menu-item {
      margin-bottom: 5mm;
      break-inside: avoid;
      page-break-inside: avoid;
      overflow: visible;
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      width: 100%;
    }
    
    .item-title {
      font-weight: bold;
      font-size: 12pt;
      width: auto;
      white-space: normal;
      margin-right: 10px;
      max-width: 60%;
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
    }
    
    .item-allergens {
      width: auto;
      font-size: 10pt;
      white-space: nowrap;
      margin-right: 10px;
    }
    
    .item-dots {
      flex-grow: 1;
      position: relative;
      top: -3px;
      border-bottom: 1px dotted #000;
    }
    
    .item-price {
      text-align: right;
      font-weight: bold;
      width: auto;
      white-space: nowrap;
      margin-left: 10px;
    }
    
    .item-description {
      font-size: 10pt;
      font-style: italic;
      margin-top: 2mm;
      width: auto;
      max-width: 95%;
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
    }
    
    .allergens-section {
      margin-top: 20mm;
      border-top: 1px solid #000;
      padding-top: 5mm;
      break-before: page;
    }
    
    .allergens-title {
      font-size: 14pt;
      font-weight: bold;
      margin-bottom: 5mm;
      text-transform: uppercase;
    }
    
    .allergens-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    
    .allergen-item {
      display: flex;
      align-items: center;
      break-inside: avoid;
    }
    
    .allergen-number {
      display: inline-block;
      width: 20px;
      height: 20px;
      background-color: #f0f0f0;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
      margin-right: 8px;
      font-weight: bold;
    }
    
    .allergen-content {
      flex: 1;
    }
    
    .allergen-title {
      font-weight: bold;
    }
    
    .allergen-description {
      font-size: 9pt;
      color: #555;
    }

    /* Pagina di copertina */
    .cover-page {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      text-align: center;
    }

    .cover-title {
      font-size: 36pt;
      font-weight: bold;
      margin-bottom: 10mm;
    }

    .cover-subtitle {
      font-size: 18pt;
      margin-bottom: 20mm;
    }

    .page-number {
      position: absolute;
      bottom: 10mm;
      right: 15mm;
      font-size: 10pt;
      color: #888;
    }
    
    @media print {
      html, body {
        width: 210mm;
        height: 297mm;
      }
      
      .page {
        margin: 0;
        padding: 20mm 15mm;
        box-shadow: none;
        overflow: visible;
        height: auto;
      }
      
      .page-break {
        page-break-before: always;
      }
    }
  `;
};

/**
 * Script to add page numbers and trigger printing
 */
export const getPrintScript = (): string => {
  return `
    window.onload = function() {
      // Add page numbers
      const pages = document.querySelectorAll('.page');
      pages.forEach((page, index) => {
        if (index > 0) { // Skip the cover page
          const pageNumber = document.createElement('div');
          pageNumber.className = 'page-number';
          pageNumber.textContent = index;
          page.appendChild(pageNumber);
        }
      });
      
      // Trigger print dialog after a short delay
      setTimeout(function() {
        window.print();
        // setTimeout(function() { window.close(); }, 500);
      }, 500);
    };
  `;
};
