
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
      overflow: hidden; /* Modificato da "visible" a "hidden" per contenere correttamente il contenuto */
    }
    
    .page:last-of-type {
      page-break-after: avoid;
      break-after: avoid;
    }
    
    .menu-container {
      margin: 0 auto;
      max-width: 100%;
      overflow: hidden; /* Modificato da "visible" a "hidden" */
      height: 100%;
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
      }
      
      /* Assicura che gli elementi non siano divisi tra pagine */
      .menu-item {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }
  `;
};
