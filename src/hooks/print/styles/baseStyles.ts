
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
