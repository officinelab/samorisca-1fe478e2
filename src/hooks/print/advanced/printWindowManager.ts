
import { cleanElementForPrint, collectStylesheets, collectGoogleFonts } from '@/utils/printUtils';
import { generatePrintStyles } from './printStyles';

export const createPrintWindow = (pages: Element[]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('❌ Impossibile aprire finestra di stampa');
    return null;
  }

  // Pulisci e prepara le pagine per la stampa
  const cleanedPages = pages.map(page => cleanElementForPrint(page as HTMLElement));

  // Costruisci HTML di stampa
  const printContent = cleanedPages
    .map(page => `<div class="print-page">${page.innerHTML}</div>`)
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

  return printWindow;
};

export const triggerPrint = (printWindow: Window, totalPages: number) => {
  setTimeout(() => {
    console.log('🖨️ Apertura finestra di stampa completata con', totalPages, 'pagine');
    printWindow.focus();
    printWindow.print();
  }, 1000);
};
