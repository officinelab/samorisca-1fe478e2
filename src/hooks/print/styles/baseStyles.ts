
/**
 * Base CSS styles to be applied to the print window
 */
export const getBaseStyles = (): string => {
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
      overflow-wrap: break-word;
      word-wrap: break-word;
    }
    
    .page {
      width: 210mm;
      height: 297mm;
      padding: 20mm 15mm;
      box-sizing: border-box;
      page-break-after: always;
      break-after: page;
      position: relative;
      overflow: hidden;
    }
    
    .page:last-of-type {
      page-break-after: avoid;
      break-after: avoid;
    }
    
    .menu-container {
      margin: 0 auto;
      max-width: 100%;
      overflow: hidden;
      height: 100%;
    }
    
    /* Previeni divisioni di elementi critici */
    .category-title {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    
    .menu-item {
      break-inside: avoid !important; 
      page-break-inside: avoid !important;
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
        overflow: hidden;
        height: auto;
      }
      
      .page-break {
        page-break-before: always;
        break-before: page;
      }
      
      /* Assicura che gli elementi non siano divisi tra pagine */
      .category-title,
      .menu-item {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
    }
  `;
};
