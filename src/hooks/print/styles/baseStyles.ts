
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
      overflow: hidden; /* Contenere il contenuto all'interno della pagina */
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
      
      /* Stringenti regole per prevenire che elementi siano divisi tra pagine */
      .menu-item, .category-title, .category {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      
      /* Assicurati che gli elementi non si estendano oltre i margini */
      .item-title, .item-description {
        max-width: 100%;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        hyphens: auto;
      }
    }
  `;
};
