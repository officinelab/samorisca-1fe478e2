
import { cleanElementForPrint, collectStylesheets, collectGoogleFonts } from '@/utils/printUtils';
import { generatePrintStyles } from './printStyles';

export const createPrintWindow = (pages: Element[]) => {
  console.log('🖨️ Creating print window with', pages.length, 'pages');
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('❌ Impossibile aprire finestra di stampa');
    return null;
  }

  // Pulisci e prepara le pagine per la stampa mantenendo gli stili inline
  const cleanedPages = pages.map((page, index) => {
    console.log(`🧹 Cleaning page ${index + 1}...`);
    return cleanElementForPrint(page as HTMLElement);
  });

  // Elimina duplicati basati sul contenuto
  const uniquePages = [];
  const seenContent = new Set();
  
  for (let i = 0; i < cleanedPages.length; i++) {
    const page = cleanedPages[i];
    const contentSignature = page.textContent?.substring(0, 100) + page.children.length;
    
    if (!seenContent.has(contentSignature)) {
      seenContent.add(contentSignature);
      uniquePages.push(page);
      console.log(`✅ Page ${i + 1} added (unique content)`);
    } else {
      console.log(`⚠️ Page ${i + 1} skipped (duplicate content detected)`);
    }
  }

  console.log(`📄 Final page count: ${uniquePages.length} (removed ${cleanedPages.length - uniquePages.length} duplicates)`);

  // Costruisci HTML di stampa con pagine uniche
  const printContent = uniquePages
    .map((page, index) => {
      console.log(`📝 Building print content for page ${index + 1}`);
      return `<div class="print-page">${page.innerHTML}</div>`;
    })
    .join('\n');

  const printStyles = generatePrintStyles();

  // Scrivi nella finestra di stampa
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Menu Completo - Stampa</title>
        ${collectGoogleFonts()}
        ${collectStylesheets()}
        ${printStyles}
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);

  printWindow.document.close();
  console.log('✅ Print window content written successfully');

  return printWindow;
};

export const triggerPrint = (printWindow: Window, totalPages: number) => {
  setTimeout(() => {
    console.log('🖨️ Triggering print dialog for', totalPages, 'unique pages');
    printWindow.focus();
    printWindow.print();
  }, 1000);
};
